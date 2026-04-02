import type { JoinRequest } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JoinRequestsClient from "./JoinRequestsClient";

export default async function JoinRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verificar onboarding
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.bio || !profile?.skills?.length) redirect("/onboarding");

  // Obtener solicitudes recibidas para proyectos del usuario
  const { data: joinRequests } = await supabase
    .from("join_requests")
    .select(
      `
      id,
      estado,
      mensaje,
      created_at,
      user:users(id, nombre, bio, skills, ubicacion, foto),
      project:projects(id, nombre),
      vacancy:vacancies(titulo)
    `,
    )
    .in(
      "project_id",
      // Subquery: obtener todos los proyectos del usuario
      (
        await supabase.from("projects").select("id").eq("owner_id", user.id)
      ).data?.map((p) => p.id) || [],
    )
    .order("created_at", { ascending: false });

  return (
    <JoinRequestsClient 
      joinRequests={(joinRequests || []).map((req: Record<string, unknown>) => ({
        id: req.id as string,
        user_id: req.user_id as string || "",
        project_id: req.project_id as string || "",
        vacancy_id: req.vacancy_id as string | null || null,
        mensaje: req.mensaje as string || "",
        estado: (req.estado as string) as "pendiente" | "aprobada" | "rechazada",
        created_at: req.created_at as string,
        user: Array.isArray(req.user) && req.user[0] ? req.user[0] : undefined,
        project: Array.isArray(req.project) && req.project[0] ? req.project[0] : undefined,
        vacancy: Array.isArray(req.vacancy) && req.vacancy[0] ? req.vacancy[0] : undefined,
      })) as JoinRequest[]} 
    />
  );
}
