import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.bio || !profile?.skills?.length) redirect("/onboarding");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060F",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');`}</style>

      {/* Nav */}
      <nav
        style={{
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg,#06D6A0,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: 15,
                fontFamily: "Syne,sans-serif",
              }}
            >
              P
            </span>
          </div>
          <span
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "#F1F5F9",
              letterSpacing: "-0.03em",
            }}
          >
            Pactum
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#06D6A0,#8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
            }}
          >
            {profile.nombre?.charAt(0) || user.email?.charAt(0)}
          </div>
          <span style={{ fontSize: 14, color: "#94A3B8" }}>
            {profile.nombre || user.email}
          </span>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: "-0.03em",
              color: "#F1F5F9",
              marginBottom: 8,
            }}
          >
            Bienvenido, {profile.nombre?.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 16 }}>
            Tu perfil está listo. En breve el algoritmo encontrará tus primeros
            matches.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            {
              label: "Matches sugeridos",
              value: "0",
              note: "El algoritmo trabaja en esto",
            },
            {
              label: "Solicitudes enviadas",
              value: "0",
              note: "3 disponibles este mes",
            },
            {
              label: "Proyectos vistos",
              value: "0",
              note: "Empieza a explorar",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "24px",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "#475569",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#F1F5F9",
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "28px",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "#F1F5F9",
              marginBottom: 16,
            }}
          >
            Tu perfil
          </h3>
          <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 8 }}>
            <strong style={{ color: "#F1F5F9" }}>Ciudad:</strong>{" "}
            {profile.ubicacion}
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#94A3B8",
              marginBottom: 16,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#F1F5F9" }}>Bio:</strong> {profile.bio}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {profile.skills?.map((s: string) => (
              <span
                key={s}
                style={{
                  background: "rgba(6,214,160,0.12)",
                  border: "1px solid rgba(6,214,160,0.2)",
                  borderRadius: 100,
                  padding: "4px 12px",
                  fontSize: 12,
                  color: "#06D6A0",
                  fontWeight: 600,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        <div
          style={{
            marginTop: 20,
            background:
              "linear-gradient(135deg,rgba(6,214,160,0.08),rgba(139,92,246,0.08))",
            border: "1px solid rgba(6,214,160,0.15)",
            borderRadius: 16,
            padding: "28px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 28 }}>🚀</p>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#F1F5F9",
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            Matches y directorio — Sprint 2
          </h3>
          <p style={{ color: "#94A3B8", fontSize: 15 }}>
            El motor de matching y el directorio de proyectos están en
            construcción. Vuelve pronto.
          </p>
        </div>
      </main>
    </div>
  );
}
