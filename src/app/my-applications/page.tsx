import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MyApplicationsClient from "./MyApplicationsClient";

export default async function MyApplicationsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check if user completed onboarding
  const { data: userProfile } = await supabase
    .from("users")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!userProfile?.onboarding_completed) {
    redirect("/onboarding");
  }

  // Fetch all join requests sent by current user with project and vacancy info
  const { data: applications, error } = await supabase
    .from("join_requests")
    .select(
      `
      id,
      project_id,
      vacancy_id,
      mensaje,
      estado,
      created_at,
      projects:project_id(nombre, descripcion, sector, etapa, owner_id),
      vacancies:vacancy_id(titulo, descripcion)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return <div className="p-4">Error loading applications</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          Mis Solicitudes Enviadas
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#9ca3af",
            marginBottom: "32px",
          }}
        >
          Monitorea el estado de tus aplicaciones a proyectos
        </p>

        <MyApplicationsClient applications={(applications || []) as any} />
      </div>
    </div>
  );
}
