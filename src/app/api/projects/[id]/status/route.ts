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
    if (!["activo", "pausado"].includes(estado)) {
      return NextResponse.json(
        { error: "Estado inválido (debe ser 'activo' o 'pausado')" },
        { status: 400 },
      );
    }

    // Verificar que el usuario es dueño del proyecto
    const { data: project } = await supabase
      .from("projects")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    if (project.owner_id !== user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para cambiar el estado de este proyecto" },
        { status: 403 },
      );
    }

    // Actualizar estado
    const { data, error } = await supabase
      .from("projects")
      .update({ estado })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al actualizar estado" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in PATCH /api/projects/[id]/status:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
