import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ProjectDetailClient
      project={project}
      currentUserId={user?.id || null}
    />
  );
}
