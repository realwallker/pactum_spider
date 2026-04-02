import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectDetailClient from "@/app/projects/[id]/ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch del proyecto
  const { data: project } = await supabase
    .from("projects")
    .select(
      `
      *,
      vacancies(*),
      owner:users(nombre, ubicacion, foto, skills)
    `,
    )
    .eq("id", id)
    .single();

  if (!project) {
    redirect("/directorio");
  }

  // Obtener usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ProjectDetailClient project={project} currentUserId={user?.id || null} />
  );
}
