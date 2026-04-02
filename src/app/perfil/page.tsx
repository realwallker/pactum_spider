import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PerfilNav } from "@/components/PerfilNav";

const C = {
  bg: "#05060F",
  surface: "#0A0C1A",
  card: "rgba(255,255,255,0.04)",
  cardHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  cyan: "#06D6A0",
  cyanDim: "rgba(6,214,160,0.12)",
  violet: "#8B5CF6",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

export default async function PerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
        background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: C.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; word-wrap: break-word; overflow-wrap: break-word; }
        .skill-badge {
          background: ${C.cyanDim};
          border: 1px solid rgba(6,214,160,0.2);
          border-radius: 100px;
          padding: clamp(3px, 1vw, 4px) clamp(10px, 2vw, 14px);
          font-size: clamp(11px, 1.5vw, 12px);
          color: ${C.cyan};
          font-weight: 600;
          word-wrap: break-word;
          white-space: normal;
        }
        .interest-badge {
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 100px;
          padding: clamp(3px, 1vw, 4px) clamp(10px, 2vw, 14px);
          font-size: clamp(11px, 1.5vw, 12px);
          color: #8B5CF6;
          font-weight: 600;
          word-wrap: break-word;
          white-space: normal;
        }
        .profile-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(12px, 3vw, 16px);
        }
        button {
          transition: all 0.2s;
          min-height: 40px;
        }
        button:hover {
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .profile-info-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(10px, 2vw, 12px) !important;
          }
        }
        @media (max-width: 480px) {
          .profile-info-grid {
            gap: clamp(8px, 1.5vw, 10px) !important;
          }
          button {
            min-height: 36px;
            padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px) !important;
            font-size: clamp(12px, 1.5vw, 13px) !important;
          }
        }
      `}</style>

      <PerfilNav />

      {/* MAIN */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(32px, 6vw, 48px) clamp(16px, 4vw, 32px)", width: "100%", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.cyan, marginBottom: 12 }}>
            Tu Perfil
          </p>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: "-0.03em", color: C.text, marginBottom: 8 }}>
            {userProfile.nombre}
          </h1>
          <p style={{ color: C.muted, fontSize: 16 }}>
            Información pública de tu perfil
          </p>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 32,
            marginBottom: 24,
          }}
        >
          {/* Avatar Section */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            {userProfile.foto ? (
              <Image
                src={userProfile.foto}
                alt={userProfile.nombre || "Profile"}
                width={120}
                height={120}
                style={{
                  borderRadius: "50%",
                  marginBottom: 16,
                  objectFit: "cover",
                  border: `3px solid ${C.cyan}`,
                }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.cyan},${C.violet})`,
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                  fontWeight: 700,
                }}
              >
                {userProfile.nombre?.charAt(0)?.toUpperCase() || "👤"}
              </div>
            )}
            <h2
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: C.text,
                marginBottom: 4,
              }}
            >
              {userProfile.nombre}
            </h2>
            <p style={{ fontSize: 14, color: C.muted }}>
              📍 {userProfile.ubicacion || "Ubicación no especificada"}
            </p>
          </div>

          {/* Info Grid */}
          <div
            className="profile-info-grid"
            style={{
              marginBottom: 24,
            }}
          >
            <div
              style={{
                padding: "clamp(12px, 2.5vw, 16px)",
                background: C.surface,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                word-wrap: "break-word",
                overflow-wrap: "break-word",
              }}
            >
              <p style={{ fontSize: 11, color: C.dimmed, marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Email
              </p>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>
                {user.email}
              </p>
            </div>

            <div
              style={{
                padding: "clamp(12px, 2.5vw, 16px)",
                background: C.surface,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                word-wrap: "break-word",
                overflow-wrap: "break-word",
              }}
            >
              <p style={{ fontSize: 11, color: C.dimmed, marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Rol
              </p>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.cyan }}>
                {userProfile.rol === "founder"
                  ? "👨‍💼 Fundador"
                  : userProfile.rol === "investor"
                    ? "💰 Inversor"
                    : "👤 Usuario"}
              </p>
            </div>
          </div>

          {/* Bio */}
          {userProfile.bio && (
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.dimmed,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Bio
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.6,
                }}
              >
                {userProfile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {userProfile.skills && userProfile.skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.dimmed,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Habilidades
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {userProfile.skills.map((skill: string) => (
                  <span key={skill} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Intereses */}
          {userProfile.intereses && userProfile.intereses.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.dimmed,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Intereses
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {userProfile.intereses.map((interes: string) => (
                  <span key={interes} className="interest-badge">
                    {interes}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Edit Button */}
          <Link href="/perfil/edit" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)",
                borderRadius: 10,
                border: "none",
                background: C.cyan,
                color: "#020A08",
                fontSize: "clamp(13px, 2vw, 16px)",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                minHeight: "40px",
              }}
            >
              ✏️ Editar Perfil
            </button>
          </Link>
        </div>

        {/* CTA */}
        <div
          style={{
            background: "linear-gradient(135deg,rgba(6,214,160,0.08),rgba(139,92,246,0.08))",
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "clamp(16px, 3vw, 24px)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "clamp(11px, 1.5vw, 13px)", color: C.muted, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            ¿Listo para encontrar socios?
          </p>
          <p style={{ fontSize: "clamp(14px, 2.5vw, 18px)", color: C.text, marginBottom: 16, fontWeight: 700 }}>
            Descubre perfiles complementarios con nuestro algoritmo
          </p>
          <Link href="/matches" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)",
                borderRadius: 10,
                border: "none",
                background: C.cyan,
                color: "#020A08",
                fontSize: "clamp(13px, 2vw, 15px)",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                minHeight: "40px",
              }}
            >
              Ver mis matches →
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
