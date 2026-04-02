import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const status = request.nextUrl.searchParams.get("status");
    const cursor = request.nextUrl.searchParams.get("cursor");
    const limit = 20;

    let query = supabase
      .from("matches")
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
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("estado", status);
    }

    if (cursor) {
      query = query.lt("created_at", decodeURIComponent(cursor));
    }

    const { data: matches, error } = await query.limit(limit + 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hasMore = (matches?.length || 0) > limit;
    const result = hasMore ? matches?.slice(0, limit) : matches;

    const formattedMatches = result?.map((match: Record<string, unknown>) => ({
      id: match.id,
      user_a_id: match.user_a_id,
      user_b_id: match.user_b_id,
      score: match.score,
      estado: match.estado,
      created_at: match.created_at,
      other_user: match.user_a_id === user.id ? match.user_b : match.user_a,
      is_user_a: match.user_a_id === user.id,
    }));

    return NextResponse.json({
      matches: formattedMatches || [],
      nextCursor: hasMore
        ? encodeURIComponent(result?.[limit - 1]?.created_at || "")
        : null,
      total: formattedMatches?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
