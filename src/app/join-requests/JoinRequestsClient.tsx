"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JoinRequest } from "@/lib/types";

const C = {
  bg: "#05060F",
  surface: "#0A0C1A",
  card: "rgba(255,255,255,0.04)",
  cardHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  cyan: "#06D6A0",
  cyanDim: "rgba(6,214,160,0.12)",
  green: "#10B981",
  greenDim: "rgba(16,185,129,0.12)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.12)",
  amber: "#FBBF24",
  amberDim: "rgba(251,191,36,0.12)",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

const STATUS_COLORS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  pendiente: { bg: C.amberDim, color: C.amber, label: "⏳ Pendiente" },
  aprobada: { bg: C.greenDim, color: C.green, label: "✓ Aprobada" },
  rechazada: { bg: C.redDim, color: C.red, label: "✗ Rechazada" },
};

export default function JoinRequestsClient({
  joinRequests: initialRequests,
}: {
  joinRequests: JoinRequest[];
}) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [filterStatus, setFilterStatus] = useState<string>("pendiente");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = requests.filter((r) => {
    if (filterStatus === "all") return true;
    return r.estado === filterStatus;
  });

  const pendingCount = requests.filter((r) => r.estado === "pendiente").length;
  const approvedCount = requests.filter((r) => r.estado === "aprobada").length;
  const rejectedCount = requests.filter((r) => r.estado === "rechazada").length;

  const updateRequest = async (
    requestId: string,
    newState: "aprobada" | "rechazada",
  ) => {
    setLoading(requestId);
    setError("");

    try {
      const response = await fetch(`/api/join-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newState }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar");
      }

      // Actualizar estado local
      setRequests(
        requests.map((r) =>
          r.id === requestId ? { ...r, estado: newState } : r,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
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
        .filter-chip { padding:10px 18px; border-radius:100px; border:1px solid ${C.border}; 
          background:transparent; color:${C.muted}; font-size:13px; font-weight:600; cursor:pointer; 
          transition:all 0.15s; font-family:'Plus Jakarta Sans',sans-serif; white-space:nowrap; }
        .filter-chip:hover { border-color:${C.borderHover}; color:${C.text}; }
        .filter-chip.active { background:${C.cyanDim}; border-color:rgba(6,214,160,0.35); color:${C.cyan}; }
        .btn { border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; 
          font-weight:600; border-radius:8px; transition:all 0.2s; font-size:13px; padding:10px 16px; }
        .btn-approve { background:${C.greenDim}; color:${C.green}; border:1px solid ${C.green}; }
        .btn-approve:hover { background:${C.green}; color:#fff; }
        .btn-reject { background:${C.redDim}; color:${C.red}; border:1px solid ${C.red}; }
        .btn-reject:hover { background:${C.red}; color:#fff; }
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
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link
            href="/directorio"
            style={{
              color: C.muted,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Directorio
          </Link>
          <Link
            href="/projects"
            style={{
              color: C.muted,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Mis Proyectos
          </Link>
          <Link
            href="/join-requests"
            style={{
              color: C.cyan,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Solicitudes
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px" }}>
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
            Solicitudes Recibidas
          </h1>
          <p style={{ color: C.muted, fontSize: 15 }}>
            Personas que quieren unirse a tus proyectos
          </p>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            { label: "Pendientes", value: pendingCount, color: C.amber },
            { label: "Aprobadas", value: approvedCount, color: C.green },
            { label: "Rechazadas", value: rejectedCount, color: C.red },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: C.muted,
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "Syne,sans-serif",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ERROR */}
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

        {/* FILTERS */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {["pendiente", "aprobada", "rechazada", "all"].map((status) => (
            <button
              key={status}
              className={`filter-chip ${filterStatus === status ? "active" : ""}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === "all"
                ? "Todas"
                : status === "pendiente"
                  ? "Pendientes"
                  : status === "aprobada"
                    ? "Aprobadas"
                    : "Rechazadas"}
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 ? (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 60,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {filterStatus === "pendiente"
                ? "No hay solicitudes pendientes"
                : filterStatus === "aprobada"
                  ? "Aún no has aprobado solicitudes"
                  : "Aún no has rechazado solicitudes"}
            </h2>
            <p style={{ color: C.muted, fontSize: 14 }}>
              {filterStatus === "pendiente"
                ? "Cuando alguien aplique a tu proyecto, aparecerá aquí"
                : "Las solicitudes que apruebes o rechaces aparecerán en su filtro"}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filtered.map((req) => {
              const statusInfo = STATUS_COLORS[req.estado];
              return (
                <div
                  key={req.id}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    padding: 24,
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 20,
                    alignItems: "start",
                  }}
                >
                  {/* LEFT - Solicitante Info */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: 16,
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#06D6A0,#8B5CF6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {req.user?.nombre?.charAt(0) || "?"}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            marginBottom: 8,
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                fontWeight: 700,
                                fontSize: 16,
                                marginBottom: 4,
                              }}
                            >
                              {req.user?.nombre}
                            </h3>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 13,
                                  color: C.muted,
                                }}
                              >
                                📍 {req.user?.ubicacion || "Sin ubicación"}
                              </span>
                              <span
                                style={{
                                  fontSize: 12,
                                  color: C.dimmed,
                                }}
                              >
                                Aplicó a: <strong>{req.project?.nombre}</strong>
                                {req.vacancy?.titulo &&
                                  ` - ${req.vacancy.titulo}`}
                              </span>
                            </div>
                          </div>
                          <span
                            style={{
                              background: statusInfo.bg,
                              color: statusInfo.color,
                              padding: "4px 12px",
                              borderRadius: 100,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Message */}
                        <div
                          style={{
                            background: C.surface,
                            border: `1px solid ${C.border}`,
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 12,
                            fontSize: 13,
                            color: C.muted,
                            lineHeight: 1.6,
                          }}
                        >
                          &quot;{req.mensaje}&quot;
                        </div>

                        {/* Skills */}
                        {req.user && req.user.skills && req.user.skills.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            {req.user.skills
                              .slice(0, 5)
                              .map((skill: string) => (
                                <span
                                  key={skill}
                                  style={{
                                    background: "rgba(6,214,160,0.1)",
                                    border: `1px solid rgba(6,214,160,0.2)`,
                                    color: C.cyan,
                                    padding: "3px 10px",
                                    borderRadius: 100,
                                    fontSize: 11,
                                    fontWeight: 600,
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            {req.user.skills.length > 5 && (
                              <span
                                style={{
                                  color: C.muted,
                                  fontSize: 12,
                                  padding: "3px 10px",
                                }}
                              >
                                +{req.user.skills.length - 5} más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT - Actions */}
                  {req.estado === "pendiente" && (
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn btn-approve"
                        onClick={() => updateRequest(req.id, "aprobada")}
                        disabled={loading === req.id}
                      >
                        ✓ Aprobar
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => updateRequest(req.id, "rechazada")}
                        disabled={loading === req.id}
                      >
                        ✗ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
