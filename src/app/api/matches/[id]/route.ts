import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { estado } = body;

    if (!["aceptado", "rechazado", "pendiente"].includes(estado)) {
      return NextResponse.json(
        { error: "Invalid estado value" },
        { status: 400 }
      );
    }

    // Fetch the match
    const { data: match, error: fetchError } = await supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Verify user is part of this match
    if (match.user_a_id !== user.id && match.user_b_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update match status
    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({
        estado,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        id,
        user_a_id,
        user_b_id,
        score,
        estado,
        created_at,
        user_a:users!user_a_id(id, nombre, foto, ubicacion, bio, skills, intereses),
        user_b:users!user_b_id(id, nombre, foto, ubicacion, bio, skills, intereses)
      `
      )
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // If accepted, create match_room
    if (estado === "aceptado") {
      const { error: roomError } = await supabase
        .from("match_rooms")
        .insert({
          match_id: id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (roomError && !roomError.message.includes("duplicate")) {
        console.error("Error creating match room:", roomError);
      }
    }

    const formattedMatch = {
      ...updatedMatch,
      other_user: updatedMatch.user_a_id === user.id ? updatedMatch.user_b : updatedMatch.user_a,
      is_user_a: updatedMatch.user_a_id === user.id,
    };

    return NextResponse.json(formattedMatch);
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
