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
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const currentUser = currentUserData as UserProfile;

    // Fetch all other users
    const { data: allUsers, error: allUsersError } = await supabase
      .from("users")
      .select("*")
      .neq("id", user.id);

    if (allUsersError || !allUsers) {
      return NextResponse.json(
        { error: "Error fetching users" },
        { status: 500 }
      );
    }

    // Calculate matches
    const matchesToCreate: Array<{
      user_a_id: string;
      user_b_id: string;
      score: number;
      estado: string;
    }> = [];

    for (const otherUser of allUsers) {
      const score = calculateMatchScore(
        currentUser,
        otherUser as UserProfile
      );

      if (meetsMatchThreshold(score)) {
        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from("matches")
          .select("id")
          .or(
            `and(user_a_id.eq.${user.id},user_b_id.eq.${otherUser.id}),and(user_a_id.eq.${otherUser.id},user_b_id.eq.${user.id})`
          )
          .limit(1);

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
          { error: insertError.message },
          { status: 500 }
        );
      }

      newMatchesCreated = inserted?.length || 0;
    }

    const responseData = {
      message: "Matches calculados y guardados",
      total_calculated: matchesToCreate.length,
      new_matches_created: newMatchesCreated,
      existing_matches: allUsers.length - matchesToCreate.length,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
