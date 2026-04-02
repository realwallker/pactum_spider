"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";

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
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.12)",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

const ETAPA_COLORS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  idea: { bg: C.violetDim, color: C.violet, label: "💡 Idea" },
  mvp: { bg: C.cyanDim, color: C.cyan, label: "🚀 MVP" },
  crecimiento: { bg: C.amberDim, color: C.amber, label: "📈 Crecimiento" },
};

export default function ProjectsClient({
  projects,
}: {
  projects: Project[];
}) {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const toggleStatus = async (projectId: string, currentStatus: string) => {
    const newStatus = currentStatus === "activo" ? "pausado" : "activo";
    setLoading(projectId);
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cambiar estado");
      }

      await response.json();
      setProjectsList(
        projectsList.map((p) =>
          p.id === projectId ? { ...p, estado: newStatus } : p,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar estado");
    } finally {
      setLoading(null);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("¿Estás seguro? Esta acción no se puede deshacer.")) return;

    setLoading(projectId);
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar");
      }

      setProjectsList(projectsList.filter((p) => p.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setLoading(null);
    }
  };

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
        * { margin:0; padding:0; box-sizing:border-box; }
        .nav { display:flex; gap:24px; align-items:center; }
        .nav-link { color:${C.muted}; text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; cursor:pointer; }
        .nav-link:hover { color:${C.text}; }
        .btn { border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; border-radius:8px; transition:all 0.2s; font-size:13px; }
        .btn-primary { background:${C.cyan}; color:#020A08; padding:10px 20px; }
        .btn-primary:hover { background:#04EFB2; }
        .btn-secondary { background:${C.card}; color:${C.text}; border:1px solid ${C.border}; padding:9px 18px; }
        .btn-secondary:hover { background:${C.cardHover}; border-color:${C.borderHover}; }
        .btn-danger { background:${C.redDim}; color:${C.red}; border:1px solid rgba(239,68,68,0.3); padding:9px 18px; }
        .btn-danger:hover { background:rgba(239,68,68,0.2); border-color:${C.red}; }
        .project-card { background:${C.card}; border:1px solid ${C.border}; border-radius:14px; padding:20px; transition:all 0.25s; }
        .project-card:hover { background:${C.cardHover}; border-color:${C.borderHover}; }
        .badge { display:inline-block; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:600; }
        .vacancy-count { background:rgba(139,92,246,0.1); color:${C.violet}; }
        .status-active { background:rgba(6,214,160,0.1); color:${C.cyan}; }
        .status-paused { background:${C.redDim}; color:${C.red}; }
      `}</style>

      {/* HEADER */}
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
        <div className="nav">
          <span className="nav-link" onClick={() => router.push("/directorio")}>
            Directorio
          </span>
          <span className="nav-link" onClick={() => router.push("/dashboard")}>
            Dashboard
          </span>
          <span
            className="nav-link"
            onClick={() => router.push("/projects")}
            style={{ color: C.cyan, fontWeight: 700 }}
          >
            Mis Proyectos
          </span>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        {/* TITLE */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            Mis Proyectos
          </h1>
          <p style={{ color: C.muted, fontSize: 15 }}>
            Gestiona tus proyectos, edita información y cambia el estado
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              background: C.redDim,
              border: `1px solid ${C.red}`,
              color: C.red,
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {projectsList.length === 0 ? (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 60,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
              }}
            >
              📭
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              No tienes proyectos aún
            </h2>
            <p style={{ color: C.muted, marginBottom: 24, fontSize: 14 }}>
              Crea tu primer proyecto para comenzar a conectar con emprendedores
            </p>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/projects/new")}
            >
              Crear primer proyecto
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            {projectsList.map((project) => {
              const etapaInfo =
                ETAPA_COLORS[project.etapa] || ETAPA_COLORS.idea;
              const vacancyCount = project.vacancies?.length || 0;

              return (
                <div key={project.id} className="project-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          marginBottom: 8,
                        }}
                      >
                        {project.nombre}
                      </h2>
                      <p
                        style={{
                          color: C.muted,
                          fontSize: 14,
                          marginBottom: 12,
                          lineHeight: 1.5,
                        }}
                      >
                        {project.descripcion}
                      </p>
                      <div
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                      >
                        <span
                          className="badge"
                          style={{
                            background: etapaInfo.bg,
                            color: etapaInfo.color,
                          }}
                        >
                          {etapaInfo.label}
                        </span>
                        <span
                          className="badge"
                          style={{
                            background:
                              project.sector === "Tecnología"
                                ? "rgba(6,214,160,0.1)"
                                : "rgba(139,92,246,0.1)",
                            color:
                              project.sector === "Tecnología"
                                ? C.cyan
                                : C.violet,
                          }}
                        >
                          {project.sector}
                        </span>
                        <span className="badge vacancy-count">
                          {vacancyCount} vacante{vacancyCount !== 1 ? "s" : ""}
                        </span>
                        <span
                          className={`badge ${
                            project.estado === "activo"
                              ? "status-active"
                              : "status-paused"
                          }`}
                        >
                          {project.estado === "activo"
                            ? "✓ Activo"
                            : "⏸ Pausado"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      paddingTop: 16,
                      borderTop: `1px solid ${C.border}`,
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        router.push(`/projects/${project.id}/edit`)
                      }
                      disabled={loading === project.id}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => toggleStatus(project.id, project.estado)}
                      disabled={loading === project.id}
                    >
                      {project.estado === "activo" ? "⏸ Pausar" : "▶ Reactivar"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteProject(project.id)}
                      disabled={loading === project.id}
                    >
                      🗑️ Eliminar
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => router.push(`/projects/${project.id}`)}
                      style={{ marginLeft: "auto" }}
                    >
                      👁️ Ver público
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CREATE NEW PROJECT BUTTON */}
        {projectsList.length > 0 && (
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/projects/new")}
            >
              + Crear nuevo proyecto
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
