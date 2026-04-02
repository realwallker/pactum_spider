import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "./ProjectsClient";

export default async function MyProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verificar que el usuario completó onboarding
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.bio || !profile?.skills?.length) redirect("/onboarding");

  // Traer proyectos del usuario actual
  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      *,
      vacancies(*)
    `,
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return <ProjectsClient projects={projects || []} />;
}
