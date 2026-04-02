"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Project, Vacancy } from "@/lib/types";

const C = {
  bg: "#05060F",
  surface: "#0A0C1A",
  card: "rgba(255,255,255,0.04)",
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

const ETAPA_COLORS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  idea: { bg: C.violetDim, color: C.violet, label: "💡 Idea" },
  mvp: { bg: C.cyanDim, color: C.cyan, label: "🚀 MVP" },
  crecimiento: { bg: C.amberDim, color: C.amber, label: "📈 Crecimiento" },
};

export default function ProjectDetailClient({
  project,
  currentUserId,
}: {
  project: Project;
  currentUserId: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const etapaInfo = ETAPA_COLORS[project.etapa] || ETAPA_COLORS.idea;
  const vacantesAbiertas =
    project.vacancies?.filter((v: Vacancy) => v.estado === "abierta") || [];
  const isOwner = currentUserId === project.owner_id;

  const sendRequest = async () => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    if (!mensaje.trim()) {
      setError("Escribe un mensaje de presentación");
      return;
    }
    if (mensaje.trim().length < 30) {
      setError("El mensaje debe tener al menos 30 caracteres");
      return;
    }

    setSending(true);
    const { error: dbError } = await supabase.from("join_requests").insert({
      user_id: currentUserId,
      project_id: project.id,
      vacancy_id: selectedVacancy?.id || null,
      mensaje: mensaje.trim(),
      estado: "pendiente",
    });

    if (dbError) {
      setError(
        dbError.message.includes("duplicate")
          ? "Ya enviaste una solicitud para este proyecto"
          : "Error al enviar. Intenta de nuevo.",
      );
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
  };

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
        * { margin:0; padding:0; box-sizing:border-box; }
        textarea { width:100%; background:rgba(255,255,255,0.05); border:1px solid ${C.border}; border-radius:10px; padding:12px 16px; color:${C.text}; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border 0.2s; resize:none; }
        textarea:focus { border-color:${C.cyan}; }
        textarea::placeholder { color:${C.dimmed}; }
        .vacancy-card { background:rgba(255,255,255,0.03); border:1px solid ${C.border}; border-radius:12px; padding:16px 20px; cursor:pointer; transition:all 0.2s; }
        .vacancy-card:hover { border-color:${C.borderHover}; }
        .vacancy-card.selected { border-color:rgba(6,214,160,0.4); background:${C.cyanDim}; }
        .skill-tag { background:rgba(255,255,255,0.05); border:1px solid ${C.border}; border-radius:100px; padding:4px 12px; font-size:12px; color:${C.muted}; font-weight:600; }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderBottom: `1px solid ${C.border}`,
          position: "sticky",
          top: 0,
          background: "rgba(5,6,15,0.92)",
          backdropFilter: "blur(20px)",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => router.push("/directorio")}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "6px 14px",
            color: C.muted,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}
        >
          ← Directorio
        </button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span
          style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color: C.text,
            letterSpacing: "-0.02em",
          }}
        >
          {project.nombre}
        </span>
      </nav>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `linear-gradient(135deg,${C.violet},${C.cyan})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 24,
                color: "#fff",
              }}
            >
              {project.nombre.charAt(0)}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  letterSpacing: "-0.03em",
                  color: C.text,
                }}
              >
                {project.nombre}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: etapaInfo.bg,
                    color: etapaInfo.color,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 100,
                  }}
                >
                  {etapaInfo.label}
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: C.dimmed,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 100,
                  }}
                >
                  {project.sector}
                </span>
                {project.owner?.ubicacion && (
                  <span style={{ fontSize: 12, color: C.dimmed }}>
                    📍 {project.owner.ubicacion}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "24px",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: C.text,
                marginBottom: 12,
              }}
            >
              Sobre el proyecto
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>
              {project.descripcion}
            </p>
          </div>

          {/* Vacantes */}
          {vacantesAbiertas.length > 0 && (
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "24px",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.text,
                  marginBottom: 16,
                }}
              >
                {vacantesAbiertas.length} vacante
                {vacantesAbiertas.length !== 1 ? "s" : ""} abierta
                {vacantesAbiertas.length !== 1 ? "s" : ""}
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {vacantesAbiertas.map((v: Vacancy) => (
                  <div
                    key={v.id}
                    className={`vacancy-card ${selectedVacancy?.id === v.id ? "selected" : ""}`}
                    onClick={() =>
                      setSelectedVacancy(
                        selectedVacancy?.id === v.id ? null : v,
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <p
                        style={{ fontWeight: 700, fontSize: 15, color: C.text }}
                      >
                        {v.titulo}
                      </p>
                      {selectedVacancy?.id === v.id && (
                        <span
                          style={{
                            fontSize: 12,
                            color: C.cyan,
                            fontWeight: 700,
                          }}
                        >
                          ✓ Seleccionada
                        </span>
                      )}
                    </div>
                    {v.descripcion && (
                      <p
                        style={{
                          fontSize: 13,
                          color: C.muted,
                          lineHeight: 1.6,
                          marginBottom: 10,
                        }}
                      >
                        {v.descripcion}
                      </p>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {v.skills_requeridas?.map((s: string) => (
                        <span key={s} className="skill-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Founder */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: C.text,
                marginBottom: 16,
              }}
            >
              Fundador
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.violet},${C.cyan})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                {project.owner?.nombre?.charAt(0) || "?"}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                  {project.owner?.nombre}
                </p>
                <p style={{ fontSize: 13, color: C.dimmed }}>
                  📍 {project.owner?.ubicacion}
                </p>
              </div>
            </div>
            {project.owner && project.owner.skills && project.owner.skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.owner.skills.map((s: string) => (
                  <span key={s} className="skill-tag">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Apply panel */}
        <div style={{ position: "sticky", top: 80 }}>
          {isOwner ? (
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "24px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 24, marginBottom: 12 }}>👑</p>
              <p style={{ fontWeight: 700, color: C.text, marginBottom: 8 }}>
                Este es tu proyecto
              </p>
              <p style={{ fontSize: 13, color: C.muted }}>
                Puedes gestionar las solicitudes desde tu dashboard.
              </p>
            </div>
          ) : sent ? (
            <div
              style={{
                background: "rgba(6,214,160,0.08)",
                border: "1px solid rgba(6,214,160,0.25)",
                borderRadius: 16,
                padding: "28px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 36, marginBottom: 12 }}>✅</p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                ¡Solicitud enviada!
              </p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                El fundador revisará tu perfil y te notificará pronto.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.text,
                  marginBottom: 6,
                }}
              >
                ¿Quieres unirte?
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: C.muted,
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                {selectedVacancy
                  ? `Aplicando a: ${selectedVacancy.titulo}`
                  : "Selecciona una vacante arriba o aplica al proyecto en general"}
              </p>

              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.muted,
                  display: "block",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Tu mensaje ({mensaje.length}/300)
              </label>
              <textarea
                rows={5}
                maxLength={300}
                placeholder="Preséntate: quién eres, por qué este proyecto, qué aportas..."
                value={mensaje}
                onChange={(e) => {
                  setMensaje(e.target.value);
                  setError("");
                }}
              />

              {error && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 14px",
                    background: "rgba(226,75,74,0.12)",
                    border: "1px solid rgba(226,75,74,0.25)",
                    borderRadius: 8,
                    color: "#F87171",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                onClick={sendRequest}
                disabled={sending || !currentUserId}
                style={{
                  width: "100%",
                  marginTop: 16,
                  background: C.cyan,
                  color: "#020A08",
                  fontWeight: 700,
                  border: "none",
                  cursor: sending ? "not-allowed" : "pointer",
                  padding: "13px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {!currentUserId
                  ? "Inicia sesión para aplicar"
                  : sending
                    ? "Enviando..."
                    : "Quiero unirme →"}
              </button>

              {!currentUserId && (
                <button
                  onClick={() => router.push("/login")}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    background: "transparent",
                    color: C.muted,
                    border: `1px solid ${C.border}`,
                    cursor: "pointer",
                    padding: "11px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
