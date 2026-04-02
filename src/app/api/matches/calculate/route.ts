import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  calculateMatchScore,
  meetsMatchThreshold,
} from "@/lib/matching";
import type { UserProfile } from "@/lib/types";

// Simple in-memory cache for match calculations
const matchCache = new Map<
  string,
  {
    timestamp: number;
    data: Record<string, unknown>;
  }
>();

const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check cache
    const cacheKey = `matches_${user.id}`;
    const cached = matchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
      });
    }

    // Fetch current user profile
    const { data: currentUserData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError || !currentUserData) {
      console.error("User profile fetch error:", userError);
      return NextResponse.json(
        { error: "User profile not found", details: userError?.message },
        { status: 404 }
      );
    }

    const currentUser = currentUserData as UserProfile;

    // Fetch all other users
    const { data: allUsers, error: allUsersError } = await supabase
      .from("users")
      .select("*")
      .neq("id", user.id);

    if (allUsersError) {
      console.error("Fetch users error:", allUsersError);
      return NextResponse.json(
        { error: "Error fetching users", details: allUsersError.message },
        { status: 500 }
      );
    }

    // Si no hay otros usuarios, retornar sin error
    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({
        message: "No hay otros usuarios para hacer match",
        total_calculated: 0,
        new_matches_created: 0,
        existing_matches: 0,
        min_threshold: 35,
        cached: false,
      });
    }

    // Filter users with complete profiles (bio + skills + intereses)
    const validUsers = allUsers.filter(
      (u) => u.bio && u.skills?.length > 0 && u.intereses?.length > 0
    );

    if (validUsers.length === 0) {
      return NextResponse.json({
        message: "No hay otros usuarios con perfiles completos para hacer match",
        total_calculated: 0,
        new_matches_created: 0,
        existing_matches: 0,
        min_threshold: 35,
        cached: false,
      });
    }

    // Calculate matches
    const matchesToCreate: Array<{
      user_a_id: string;
      user_b_id: string;
      score: number;
      estado: string;
    }> = [];

    for (const otherUser of validUsers) {
      const score = calculateMatchScore(
        currentUser,
        otherUser as UserProfile
      );

      if (meetsMatchThreshold(score)) {
        // Check if match already exists
        const { data: existingMatch, error: matchCheckError } = await supabase
          .from("matches")
          .select("id")
          .or(
            `(user_a_id.eq.${user.id},user_b_id.eq.${otherUser.id}),(user_a_id.eq.${otherUser.id},user_b_id.eq.${user.id})`
          )
          .limit(1);

        if (matchCheckError) {
          console.error("Match check error:", matchCheckError);
        }

        // Only add if match doesn't already exist
        if (!existingMatch || existingMatch.length === 0) {
          matchesToCreate.push({
            user_a_id: user.id,
            user_b_id: otherUser.id,
            score,
            estado: "pendiente",
          });
        }
      }
    }

    // Batch insert new matches
    let newMatchesCreated = 0;
    if (matchesToCreate.length > 0) {
      const { data: inserted, error: insertError } = await supabase
        .from("matches")
        .insert(matchesToCreate)
        .select("id");

      if (insertError) {
        console.error("Error inserting matches:", insertError);
        return NextResponse.json(
          { 
            error: "Error creating matches", 
            details: insertError.message,
            code: insertError.code 
          },
          { status: 500 }
        );
      }

      newMatchesCreated = inserted?.length || 0;
    }

    const responseData = {
      message: "Matches calculados y guardados",
      total_calculated: matchesToCreate.length,
      new_matches_created: newMatchesCreated,
      existing_matches: (validUsers?.length || 0) - matchesToCreate.length,
      min_threshold: 35,
      cached: false,
    };

    // Cache the result
    matchCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error calculating matches:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
