import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { estado } = body;

    // Validar estado
    if (!["pendiente", "aprobada", "rechazada"].includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    // Obtener la solicitud e información del proyecto
    const { data: joinRequest } = await supabase
      .from("join_requests")
      .select(
        `
        id,
        project_id,
        projects!inner(owner_id)
      `,
      )
      .eq("id", id)
      .single();

    if (!joinRequest || !joinRequest.projects || joinRequest.projects.length === 0) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 },
      );
    }

    // Verificar que el usuario es owner del proyecto
    if (joinRequest.projects[0].owner_id !== user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para actualizar esta solicitud" },
        { status: 403 },
      );
    }

    // Actualizar solicitud
    const { data, error } = await supabase
      .from("join_requests")
      .update({ estado })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al actualizar solicitud" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in PATCH /api/join-requests/[id]:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // Obtener la solicitud con información del usuario y proyecto
    const { data: joinRequest } = await supabase
      .from("join_requests")
      .select(
        `
        id,
        user_id,
        project_id,
        projects(owner_id)
      `,
      )
      .eq("id", id)
      .single();

    if (!joinRequest) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 },
      );
    }

    // Verificar permiso: solo el que envió la solicitud o el owner del proyecto pueden eliminarla
    const isApplicant = joinRequest.user_id === user.id;
    const isProjectOwner = joinRequest.projects && joinRequest.projects.length > 0 && joinRequest.projects[0].owner_id === user.id;

    if (!isApplicant && !isProjectOwner) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta solicitud" },
        { status: 403 },
      );
    }

    // Eliminar solicitud
    const { error } = await supabase
      .from("join_requests")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Error al eliminar solicitud" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /api/join-requests/[id]:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
