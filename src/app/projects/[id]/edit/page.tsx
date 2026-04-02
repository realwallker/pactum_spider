import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProjectClient from "./EditProjectClient";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Traer proyecto
  const { data: project } = await supabase
    .from("projects")
    .select(
      `
      *,
      vacancies(*)
    `,
    )
    .eq("id", id)
    .single();

  if (!project) redirect("/projects");

  // Verificar que el usuario es dueño
  if (project.owner_id !== user.id) redirect("/projects");

  return <EditProjectClient project={project} projectId={id} />;
}
