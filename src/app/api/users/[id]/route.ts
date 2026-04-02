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

  // Verificar que el usuario solo pueda actualizar su propio perfil
  if (user.id !== id) {
    return NextResponse.json(
      { error: "No tienes permiso para actualizar este perfil" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { nombre, bio, skills, intereses, ubicacion, foto } = body;

    // Validar nombre
    if (!nombre || nombre.trim().length === 0) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 },
      );
    }

    if (nombre.length > 100) {
      return NextResponse.json(
        { error: "El nombre no puede exceder 100 caracteres" },
        { status: 400 },
      );
    }

    // Validar otros campos
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: "La bio no puede exceder 500 caracteres" },
        { status: 400 },
      );
    }

    if (ubicacion && ubicacion.length > 100) {
      return NextResponse.json(
        { error: "La ubicación no puede exceder 100 caracteres" },
        { status: 400 },
      );
    }

    // Actualizar perfil
    const { data, error } = await supabase
      .from("users")
      .update({
        nombre,
        bio: bio || null,
        skills: Array.isArray(skills) ? skills : [],
        intereses: Array.isArray(intereses) ? intereses : [],
        ubicacion: ubicacion || null,
        foto: foto || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Error al actualizar perfil" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in PUT /api/users/[id]:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function GET(
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

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, nombre, bio, skills, intereses, ubicacion, foto, rol")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in GET /api/users/[id]:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
