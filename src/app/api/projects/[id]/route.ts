import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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
    const { nombre, descripcion, sector, etapa } = body;

    // Validar campos requeridos
    if (!nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    if (!descripcion?.trim() || descripcion.length < 80) {
      return NextResponse.json(
        { error: "La descripción debe tener al menos 80 caracteres" },
        { status: 400 },
      );
    }

    if (!sector) {
      return NextResponse.json(
        { error: "El sector es obligatorio" },
        { status: 400 },
      );
    }

    if (!["idea", "mvp", "crecimiento"].includes(etapa)) {
      return NextResponse.json({ error: "Etapa inválida" }, { status: 400 });
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
        { error: "No tienes permiso para editar este proyecto" },
        { status: 403 },
      );
    }

    // Actualizar proyecto
    const { data, error } = await supabase
      .from("projects")
      .update({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        sector,
        etapa,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al actualizar proyecto" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in PUT /api/projects/[id]:", err);
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
        { error: "No tienes permiso para eliminar este proyecto" },
        { status: 403 },
      );
    }

    // Eliminar proyecto (las vacantes se eliminan por cascade si está configurado)
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Error al eliminar proyecto" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /api/projects/[id]:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
