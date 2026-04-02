import { createClient } from "@/lib/supabase/server";
import DirectorioClient from "./DirectorioClient";

export default async function DirectorioPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      *,
      vacancies(*),
      owner:users(nombre, ubicacion, foto)
    `,
    )
    .eq("estado", "activo")
    .order("created_at", { ascending: false });

  return <DirectorioClient projects={projects || []} />;
}
