import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

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

  // Contar solicitudes enviadas
  const { count: solicitudes } = await supabase
    .from("join_requests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Contar matches
  const { count: matches } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`);

  // Contar proyectos propios
  const { count: proyectos } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id);

  const firstName = profile.nombre?.split(" ")[0] || "emprendedor";
  const initial = profile.nombre?.charAt(0) || user.email?.charAt(0) || "U";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060F",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "#F1F5F9",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .nav-link {
          color: #94A3B8;
          text-decoration: none;
          font-size: clamp(12px, 2vw, 14px);
          font-weight: 500;
          padding: clamp(6px, 1vw, 8px) clamp(10px, 2vw, 12px);
          border-radius: 8px;
          transition: all 0.2s;
          word-wrap: break-word;
        }
        .nav-link:hover {
          color: #F1F5F9;
          background: rgba(255,255,255,0.06);
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: clamp(16px, 3vw, 24px) clamp(18px, 4vw, 28px);
          transition: all 0.2s;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .stat-card:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
        }
        .action-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: clamp(14px, 3vw, 24px);
          text-decoration: none;
          display: block;
          transition: all 0.25s;
          cursor: pointer;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .action-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-3px);
        }
        .skill-badge {
          background: rgba(6,214,160,0.12);
          border: 1px solid rgba(6,214,160,0.2);
          border-radius: 100px;
          padding: clamp(3px, 1vw, 4px) clamp(10px, 2vw, 14px);
          font-size: clamp(11px, 1.5vw, 12px);
          color: #06D6A0;
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
        .plan-badge {
          background: rgba(251,191,36,0.12);
          border: 1px solid rgba(251,191,36,0.25);
          border-radius: 100px;
          padding: clamp(2px, 0.8vw, 3px) clamp(8px, 2vw, 12px);
          font-size: clamp(10px, 1.2vw, 11px);
          color: #FBBF24;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          word-wrap: break-word;
          white-space: normal;
        }
        @media (max-width: 768px) {
          .stat-card { padding: clamp(14px, 2.5vw, 18px) clamp(16px, 3vw, 20px) !important; }
          .action-card { padding: clamp(12px, 2.5vw, 18px) !important; }
        }
        @media (max-width: 480px) {
          .stat-card { padding: clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 18px) !important; }
          .action-card { padding: clamp(10px, 2vw, 14px) !important; }
          .skill-badge { font-size: clamp(10px, 1.3vw, 11px) !important; }
          .interest-badge { font-size: clamp(10px, 1.3vw, 11px) !important; }
          .plan-badge { font-size: clamp(9px, 1vw, 10px) !important; }
        }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          background: "rgba(5,6,15,0.92)",
          backdropFilter: "blur(20px)",
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
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
                fontSize: 16,
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
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Link href="/directorio" className="nav-link">
            Directorio
          </Link>
          <Link href="/projects" className="nav-link">
            Mis Proyectos
          </Link>
          <Link href="/matches" className="nav-link">
            Mis matches
          </Link>
          <Link href="/projects/new" className="nav-link">
            Publicar proyecto
          </Link>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="plan-badge">{profile.plan}</span>
          <Link href="/perfil" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#06D6A0,#8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 15,
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              title="Ver mi perfil"
            >
              {profile.foto ? (
                <Image
                  src={profile.foto}
                  alt="Profile"
                  width={36}
                  height={36}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                initial.toUpperCase()
              )}
            </div>
          </Link>
          <span style={{ fontSize: 14, color: "#94A3B8", fontWeight: 500 }}>
            {profile.nombre || user.email}
          </span>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 52px) clamp(16px, 4vw, 32px)", width: "100%", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px,4vw,40px)",
              letterSpacing: "-0.03em",
              color: "#F1F5F9",
              marginBottom: 8,
            }}
          >
            Bienvenido, {firstName} 👋
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 16 }}>
            Tu perfil está activo. Explora proyectos y encuentra tu próximo
            socio.
          </p>
        </div>

        {/* STATS */}
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
              value: matches ?? 0,
              note: matches
                ? "Ver mis matches →"
                : "El algoritmo trabaja en esto",
              href: "/matches",
              accent: "#06D6A0",
            },
            {
              label: "Solicitudes enviadas",
              value: solicitudes ?? 0,
              note: `${3 - Math.min(solicitudes ?? 0, 3)} disponibles este mes`,
              href: "/directorio",
              accent: "#8B5CF6",
            },
            {
              label: "Mis proyectos",
              value: proyectos ?? 0,
              note: proyectos
                ? "Ver proyectos →"
                : "Publica tu primer proyecto",
              href: "/projects",
              accent: "#FBBF24",
            },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              style={{ textDecoration: "none" }}
            >
              <div className="stat-card">
                <p
                  style={{
                    fontSize: 13,
                    color: "#475569",
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: 44,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: s.accent,
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: 13, color: "#475569" }}>{s.note}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <Link
            href="/directorio"
            className="action-card"
            style={{ color: "inherit" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(6,214,160,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                🔍
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#F1F5F9",
                    marginBottom: 4,
                  }}
                >
                  Explorar directorio
                </p>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>
                  Descubre proyectos y aplica a vacantes abiertas
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/matches"
            className="action-card"
            style={{ color: "inherit" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(139,92,246,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                ⚡
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#F1F5F9",
                    marginBottom: 4,
                  }}
                >
                  Ver mis matches
                </p>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>
                  Perfiles complementarios sugeridos por el algoritmo
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/projects"
            className="action-card"
            style={{ color: "inherit" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(251,191,36,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                📋
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#F1F5F9",
                    marginBottom: 4,
                  }}
                >
                  Mis Proyectos
                </p>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>
                  Gestiona y edita tus proyectos activos
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/projects/new"
            className="action-card"
            style={{ color: "inherit" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(139,92,246,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                🚀
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#F1F5F9",
                    marginBottom: 4,
                  }}
                >
                  Publicar proyecto
                </p>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>
                  Crea un nuevo proyecto y busca socios
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/join-requests"
            className="action-card"
            style={{ color: "inherit" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(251,191,36,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                📥
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#F1F5F9",
                    marginBottom: 4,
                  }}
                >
                  Solicitudes Recibidas
                </p>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>
                  Revisa y aprueba aplicaciones a tus proyectos
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/my-applications"
            className="action-card"
            style={{ color: "inherit" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(6,214,160,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                📤
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#F1F5F9",
                    marginBottom: 4,
                  }}
                >
                  Mis Solicitudes Enviadas
                </p>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>
                  Monitorea el estado de tus aplicaciones
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* PERFIL */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: 18, color: "#F1F5F9" }}>
              Tu perfil
            </h2>
            <Link
              href="/perfil/edit"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 13,
                color: "#94A3B8",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              ✏️ Editar perfil
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  color: "#475569",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                Ciudad
              </p>
              <p style={{ fontSize: 15, color: "#F1F5F9" }}>
                📍 {profile.ubicacion || "—"}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 12,
                  color: "#475569",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                Plan
              </p>
              <span className="plan-badge">{profile.plan}</span>
            </div>
          </div>

          {profile.bio && (
            <div style={{ marginTop: 20 }}>
              <p
                style={{
                  fontSize: 12,
                  color: "#475569",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                Bio
              </p>
              <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7 }}>
                {profile.bio}
              </p>
            </div>
          )}

          {profile.skills?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p
                style={{
                  fontSize: 12,
                  color: "#475569",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Habilidades
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.skills.map((s: string) => (
                  <span key={s} className="skill-badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.intereses?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p
                style={{
                  fontSize: 12,
                  color: "#475569",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Intereses
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.intereses.map((s: string) => (
                  <span key={s} className="interest-badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA matching */}
        <div
          style={{
            marginTop: 24,
            background:
              "linear-gradient(135deg,rgba(6,214,160,0.08),rgba(139,92,246,0.08))",
            border: "1px solid rgba(6,214,160,0.15)",
            borderRadius: 20,
            padding: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "#F1F5F9",
                marginBottom: 6,
                fontFamily: "Syne,sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              El algoritmo está listo ⚡
            </h3>
            <p style={{ color: "#94A3B8", fontSize: 15 }}>
              Basado en tu perfil ya hay perfiles complementarios esperándote.
            </p>
          </div>
          <Link
            href="/matches"
            style={{
              background: "#06D6A0",
              color: "#020A08",
              fontWeight: 700,
              padding: "13px 28px",
              borderRadius: 10,
              fontSize: 15,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Ver mis matches →
          </Link>
        </div>
      </main>
    </div>
  );
}
