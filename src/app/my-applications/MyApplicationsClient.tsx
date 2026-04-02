"use client";

import { useState } from "react";

const C = {
  bg: "#0f0f1e",
  card: "#1a1a2e",
  border: "#2d2d44",
  cyan: "#06b6d4",
  text: "#ffffff",
  muted: "#9ca3af",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  pending: "#8b5cf6",
};

const statusConfig = {
  pendiente: { color: C.pending, label: "Pendiente", icon: "⏳" },
  aprobada: { color: C.success, label: "Aprobada", icon: "✓" },
  rechazada: { color: C.danger, label: "Rechazada", icon: "✕" },
};

interface Application {
  id: string;
  project_id: string;
  vacancy_id: string;
  mensaje: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  created_at: string;
  projects: {
    nombre: string;
    descripcion: string;
    sector: string;
    etapa: string;
    owner_id: string;
  };
  vacancies: {
    titulo: string;
    descripcion: string;
  };
}

interface Props {
  applications: Application[];
}

export default function MyApplicationsClient({ applications }: Props) {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pendiente" | "aprobada" | "rechazada"
  >("all");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const filtered =
    statusFilter === "all"
      ? applications
      : applications.filter((app) => app.estado === statusFilter);

  const stats = {
    total: applications.length,
    pendiente: applications.filter((a) => a.estado === "pendiente").length,
    aprobada: applications.filter((a) => a.estado === "aprobada").length,
    rechazada: applications.filter((a) => a.estado === "rechazada").length,
  };

  const handleWithdraw = async (id: string) => {
    setWithdrawingId(id);
    try {
      const response = await fetch(`/api/join-requests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Error al retirar solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al retirar solicitud");
    } finally {
      setWithdrawingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Total",
            count: stats.total,
            color: C.cyan,
          },
          {
            label: "Pendiente",
            count: stats.pendiente,
            color: C.pending,
          },
          {
            label: "Aprobada",
            count: stats.aprobada,
            color: C.success,
          },
          {
            label: "Rechazada",
            count: stats.rechazada,
            color: C.danger,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "700", color: stat.color }}>
              {stat.count}
            </div>
            <div style={{ fontSize: "12px", color: C.muted, marginTop: "8px" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {[
          { key: "all", label: "Todas" },
          { key: "pendiente", label: "Pendientes" },
          { key: "aprobada", label: "Aprobadas" },
          { key: "rechazada", label: "Rechazadas" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() =>
              setStatusFilter(
                btn.key as "all" | "pendiente" | "aprobada" | "rechazada"
              )
            }
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid " + C.border,
              background:
                statusFilter === btn.key ? C.cyan : "transparent",
              color: statusFilter === btn.key ? C.bg : C.text,
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ color: C.muted, fontSize: "16px" }}>
            {statusFilter === "all"
              ? "Aún no has enviado solicitudes"
              : `No hay solicitudes ${statusFilter}`}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map((app) => {
            const status = statusConfig[app.estado];
            return (
              <div
                key={app.id}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "8px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  {/* Project Name */}
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    {app.projects.nombre}
                  </h3>

                  {/* Vacancy Title */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: C.muted,
                      marginBottom: "8px",
                    }}
                  >
                    Posición: {app.vacancies.titulo}
                  </p>

                  {/* Status Badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: status.color + "20",
                      border: `1px solid ${status.color}`,
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: status.color,
                      marginBottom: "8px",
                    }}
                  >
                    <span>{status.icon}</span>
                    {status.label}
                  </div>

                  {/* Message */}
                  {app.mensaje && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: C.muted,
                        marginTop: "8px",
                        fontStyle: "italic",
                      }}
                    >
                      &quot;{app.mensaje}&quot;
                    </p>
                  )}

                  {/* Date */}
                  <p
                    style={{
                      fontSize: "12px",
                      color: C.muted,
                      marginTop: "8px",
                    }}
                  >
                    Enviada: {formatDate(app.created_at)}
                  </p>
                </div>

                {/* Withdraw Button */}
                {app.estado === "pendiente" && (
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    disabled={withdrawingId === app.id}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: `1px solid ${C.danger}`,
                      background: "transparent",
                      color: C.danger,
                      cursor: withdrawingId === app.id ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginLeft: "16px",
                      whiteSpace: "nowrap",
                      opacity: withdrawingId === app.id ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {withdrawingId === app.id ? "Retirando..." : "Retirar"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
