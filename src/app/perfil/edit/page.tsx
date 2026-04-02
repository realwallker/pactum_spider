import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditProfileClient from "./EditProfileClient";

export default async function EditPerfilPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!userProfile) redirect("/login");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          Editar Perfil
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#9ca3af",
            marginBottom: "32px",
          }}
        >
          Actualiza tu información pública
        </p>

        <EditProfileClient userProfile={userProfile} userId={user.id} />
      </div>
    </div>
  );
}
