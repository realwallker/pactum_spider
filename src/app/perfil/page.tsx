import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const C = {
  bg: "#0f0f1e",
  card: "#1a1a2e",
  border: "#2d2d44",
  cyan: "#06b6d4",
  text: "#ffffff",
  muted: "#9ca3af",
};

export default async function PerfilPage() {
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
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Mi Perfil
          </h1>
          <p style={{ fontSize: "16px", color: C.muted }}>
            Información pública de tu perfil
          </p>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            padding: "32px",
          }}
        >
          {/* Profile Picture */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            {userProfile.foto ? (
              <Image
                src={userProfile.foto}
                alt={userProfile.nombre || "Profile"}
                width={96}
                height={96}
                style={{
                  borderRadius: "50%",
                  marginBottom: "16px",
                  objectFit: "cover",
                  border: `2px solid ${C.cyan}`,
                }}
              />
            ) : (
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  background: C.cyan + "20",
                  border: `2px solid ${C.cyan}`,
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                }}
              >
                👤
              </div>
            )}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: C.text,
                marginBottom: "4px",
              }}
            >
              {userProfile.nombre}
            </h2>
            <p style={{ fontSize: "14px", color: C.muted }}>
              {userProfile.ubicacion || "Ubicación no especificada"}
            </p>
          </div>

          {/* Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                padding: "16px",
                background: C.bg,
                borderRadius: "6px",
                border: `1px solid ${C.border}`,
              }}
            >
              <p style={{ fontSize: "12px", color: C.muted, marginBottom: "4px" }}>
                Email
              </p>
              <p style={{ fontSize: "14px", fontWeight: "500", color: C.text }}>
                {user.email}
              </p>
            </div>

            <div
              style={{
                padding: "16px",
                background: C.bg,
                borderRadius: "6px",
                border: `1px solid ${C.border}`,
              }}
            >
              <p style={{ fontSize: "12px", color: C.muted, marginBottom: "4px" }}>
                Rol
              </p>
              <p style={{ fontSize: "14px", fontWeight: "500", color: C.text }}>
                {userProfile.rol === "founder"
                  ? "Fundador"
                  : userProfile.rol === "investor"
                    ? "Inversor"
                    : "Usuario"}
              </p>
            </div>
          </div>

          {/* Bio */}
          {userProfile.bio && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: C.muted,
                  marginBottom: "8px",
                }}
              >
                Bio
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: C.text,
                  lineHeight: "1.6",
                }}
              >
                {userProfile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {userProfile.skills && userProfile.skills.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: C.muted,
                  marginBottom: "8px",
                }}
              >
                Habilidades
              </h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {userProfile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    style={{
                      padding: "6px 12px",
                      background: C.cyan + "20",
                      border: `1px solid ${C.cyan}`,
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: C.cyan,
                      fontWeight: "500",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Intereses */}
          {userProfile.intereses && userProfile.intereses.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: C.muted,
                  marginBottom: "8px",
                }}
              >
                Intereses
              </h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {userProfile.intereses.map((interes: string) => (
                  <span
                    key={interes}
                    style={{
                      padding: "6px 12px",
                      background: "#10b98120",
                      border: "1px solid #10b981",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#10b981",
                      fontWeight: "500",
                    }}
                  >
                    {interes}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Edit Button */}
          <Link href="/perfil/edit">
            <button
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                background: C.cyan,
                color: C.bg,
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "1";
              }}
            >
              ✏️ Editar Perfil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
