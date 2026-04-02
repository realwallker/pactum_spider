"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, Vacancy } from "@/lib/types";

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
  violetDim: "rgba(139,92,246,0.12)",
  amber: "#FBBF24",
  amberDim: "rgba(251,191,36,0.12)",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

const SECTORES = [
  "Todos",
  "Tecnología",
  "Salud",
  "Educación",
  "Agro",
  "Sostenibilidad",
  "Fintech",
  "E-commerce",
];
const ETAPAS = ["Todas", "idea", "mvp", "crecimiento"];

const ETAPA_COLORS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  idea: { bg: C.violetDim, color: C.violet, label: "💡 Idea" },
  mvp: { bg: C.cyanDim, color: C.cyan, label: "🚀 MVP" },
  crecimiento: { bg: C.amberDim, color: C.amber, label: "📈 Crecimiento" },
};

export default function DirectorioClient({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [sector, setSector] = useState("Todos");
  const [etapa, setEtapa] = useState("Todas");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const matchSector = sector === "Todos" || p.sector === sector;
    const matchEtapa = etapa === "Todas" || p.etapa === etapa;
    const matchSearch =
      !search ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(search.toLowerCase());
    return matchSector && matchEtapa && matchSearch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; word-wrap: break-word; overflow-wrap: break-word; }
        input { background:rgba(255,255,255,0.05); border:1px solid ${C.border}; border-radius:10px; padding:clamp(10px, 2vw, 11px) clamp(14px, 3vw, 16px); color:${C.text}; font-size:clamp(13px, 2vw, 14px); font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:all 0.2s; width:100%; max-width:100%; word-wrap: break-word; }
        input:focus { border-color:${C.cyan}; box-shadow:0 0 0 3px rgba(6,214,160,0.1); }
        input::placeholder { color:${C.dimmed}; }
        .filter-chip { padding:clamp(6px, 1.5vw, 7px) clamp(12px, 2vw, 16px); border-radius:100px; border:1px solid ${C.border}; background:transparent; color:${C.muted}; font-size:clamp(12px, 1.5vw, 13px); font-weight:600; cursor:pointer; transition:all 0.15s; font-family:'Plus Jakarta Sans',sans-serif; white-space: normal; word-wrap: break-word; min-height: 32px; }
        .filter-chip:hover { border-color:${C.borderHover}; color:${C.text}; }
        .filter-chip.active { background:${C.cyanDim}; border-color:rgba(6,214,160,0.35); color:${C.cyan}; }
        .project-card { background:${C.card}; border:1px solid ${C.border}; border-radius:16px; padding:clamp(16px, 3vw, 24px); transition:all 0.25s; cursor:pointer; display:flex; flex-direction:column; gap:0; word-wrap: break-word; }
        .project-card:hover { background:${C.cardHover}; border-color:${C.borderHover}; transform:translateY(-3px); }
        .vacancy-tag { background:rgba(255,255,255,0.05); border:1px solid ${C.border}; border-radius:100px; padding:clamp(3px, 1vw, 4px) clamp(8px, 2vw, 12px); font-size:clamp(11px, 1.5vw, 12px); color:${C.muted}; font-weight:600; word-wrap: break-word; white-space: normal; }
        .btn-apply { background:${C.cyan}; color:#020A08; font-weight:700; border:none; cursor:pointer; padding:clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px); border-radius:8px; font-size:clamp(12px, 1.5vw, 13px); font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; white-space: normal; min-height: 40px; }
        .btn-apply:hover { background:#04EFB2; }
        .nav-link { color:${C.muted}; text-decoration:none; font-size:clamp(12px, 2vw, 14px); font-weight:500; transition:color 0.2s; cursor:pointer; word-wrap: break-word; }
        .nav-link:hover { color:${C.text}; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(clamp(260px, 90vw, 320px), 1fr)); gap: clamp(14px, 3vw, 20px); width: 100%; }
        @media (max-width: 768px) {
          .main-container { padding: clamp(24px, 5vw, 40px) clamp(14px, 3vw, 20px) !important; }
          .filter-group { overflow-x: auto; overflow-y: hidden; padding: 10px 0; }
          .filter-group::-webkit-scrollbar { height: 6px; }
          .filter-group::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
          .projects-grid { gap: clamp(12px, 2vw, 16px) !important; }
        }
        @media (max-width: 480px) {
          .main-container { padding: clamp(16px, 4vw, 24px) clamp(12px, 2vw, 16px) !important; }
          .filter-chip { min-height: 36px; padding: clamp(6px, 1.5vw, 7px) clamp(10px, 2vw, 12px) !important; font-size: clamp(11px, 1.5vw, 12px) !important; }
          .btn-apply { padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 16px) !important; font-size: clamp(11px, 1.5vw, 12px) !important; min-height: 36px; }
          .project-card { padding: clamp(12px, 2.5vw, 16px) !important; gap: 8px !important; }
          .projects-grid { grid-template-columns: repeat(auto-fill, minmax(clamp(240px, 100%, 280px), 1fr)) !important; }
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
          borderBottom: `1px solid ${C.border}`,
          position: "sticky",
          top: 0,
          background: "rgba(5,6,15,0.92)",
          backdropFilter: "blur(20px)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
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
              color: C.text,
              letterSpacing: "-0.03em",
            }}
          >
            Pactum
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span className="nav-link" onClick={() => router.push("/directorio")}>
            Directorio
          </span>
          <span className="nav-link" onClick={() => router.push("/matches")}>
            Mis matches
          </span>
          <span className="nav-link" onClick={() => router.push("/dashboard")}>
            Dashboard
          </span>
        </div>
      </nav>

      <div className="main-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(32px, 6vw, 48px) clamp(16px, 4vw, 32px)", width: "100%", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.cyan,
              marginBottom: 12,
            }}
          >
            Directorio
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 800,
                  fontSize: 36,
                  letterSpacing: "-0.03em",
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                Proyectos activos
              </h1>
              <p style={{ color: C.muted, fontSize: 16 }}>
                {filtered.length} proyecto{filtered.length !== 1 ? "s" : ""}{" "}
                encontrado{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => router.push("/projects/new")}
              style={{
                background: C.cyan,
                color: "#020A08",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                padding: "12px 24px",
                borderRadius: 10,
                fontSize: 14,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            >
              + Publicar proyecto
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <input
            placeholder="🔍  Buscar proyectos por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 12,
              color: C.dimmed,
              fontWeight: 600,
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Sector
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SECTORES.map((s) => (
              <button
                key={s}
                className={`filter-chip ${sector === s ? "active" : ""}`}
                onClick={() => setSector(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              fontSize: 12,
              color: C.dimmed,
              fontWeight: 600,
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Etapa
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ETAPAS.map((e) => (
              <button
                key={e}
                className={`filter-chip ${etapa === e ? "active" : ""}`}
                onClick={() => setEtapa(e)}
              >
                {e === "Todas" ? "Todas" : ETAPA_COLORS[e]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: C.dimmed }}
          >
            <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: C.muted,
                marginBottom: 8,
              }}
            >
              No hay proyectos con esos filtros
            </p>
            <p style={{ fontSize: 14 }}>
              Prueba cambiando el sector o la etapa
            </p>
          </div>
        ) : (
          <div
            className="projects-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
              gap: 20,
            }}
          >
            {filtered.map((p) => {
              const etapaInfo = ETAPA_COLORS[p.etapa] || ETAPA_COLORS.idea;
              const vacantesAbiertas =
                p.vacancies?.filter((v: Vacancy) => v.estado === "abierta") || [];
              return (
                <div
                  key={p.id}
                  className="project-card"
                  onClick={() => router.push(`/projects/${p.id}`)}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `linear-gradient(135deg,${C.violet},${C.cyan})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 18,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {p.nombre.charAt(0)}
                    </div>
                    <span
                      style={{
                        background: etapaInfo.bg,
                        color: etapaInfo.color,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: 100,
                      }}
                    >
                      {etapaInfo.label}
                    </span>
                  </div>

                  {/* Info */}
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: C.text,
                      marginBottom: 8,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {p.nombre}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.muted,
                      lineHeight: 1.6,
                      marginBottom: 16,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.descripcion}
                  </p>

                  {/* Sector + owner */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 100,
                        padding: "3px 10px",
                        fontSize: 12,
                        color: C.dimmed,
                        fontWeight: 600,
                      }}
                    >
                      {p.sector}
                    </span>
                    {p.owner?.ubicacion && (
                      <span style={{ fontSize: 12, color: C.dimmed }}>
                        📍 {p.owner.ubicacion}
                      </span>
                    )}
                  </div>

                  {/* Vacantes */}
                  {vacantesAbiertas.length > 0 && (
                    <div
                      style={{
                        borderTop: `1px solid ${C.border}`,
                        paddingTop: 14,
                        marginTop: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          color: C.dimmed,
                          fontWeight: 600,
                          marginBottom: 8,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {vacantesAbiertas.length} vacante
                        {vacantesAbiertas.length !== 1 ? "s" : ""} abierta
                        {vacantesAbiertas.length !== 1 ? "s" : ""}
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {vacantesAbiertas.slice(0, 3).map((v: Vacancy) => (
                          <span key={v.id} className="vacancy-tag">
                            {v.titulo}
                          </span>
                        ))}
                        {vacantesAbiertas.length > 3 && (
                          <span className="vacancy-tag">
                            +{vacantesAbiertas.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
