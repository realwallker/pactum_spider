"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Match, UserProfile } from "@/lib/types";

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
  green: "#10B981",
  red: "#EF4444",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

interface MatchWithUser extends Match {
  other_user?: UserProfile;
  is_user_a?: boolean;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("pendiente");
  const [calculatingMatches, setCalculatingMatches] = useState(false);

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const query = filterStatus === "all" ? "" : `?status=${filterStatus}`;
      const response = await fetch(`/api/matches${query}`);

      if (!response.ok) {
        throw new Error("Error al cargar matches");
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar matches");
    } finally {
      setLoading(false);
    }
  };

  const calculateMatches = async () => {
    try {
      setCalculatingMatches(true);
      const response = await fetch("/api/matches/calculate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al calcular matches");
      }

      const data = await response.json();
      if (data.new_matches_created > 0) {
        fetchMatches();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular");
    } finally {
      setCalculatingMatches(false);
    }
  };

  const updateMatchStatus = async (
    matchId: string,
    newStatus: "aceptado" | "rechazado"
  ) => {
    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar match");
      }

      fetchMatches();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
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
        .nav-link { color:${C.muted}; text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; cursor:pointer; }
        .nav-link:hover { color:${C.text}; }
        .match-card { background:${C.card}; border:1px solid ${C.border}; border-radius:14px; padding:20px; transition:all 0.3s; }
        .match-card:hover { background:${C.cardHover}; border-color:${C.borderHover}; transform:translateY(-2px); }
        .score-badge { width:60px; height:60px; border-radius:50%; background:${C.cyanDim}; color:${C.cyan}; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px; flex-shrink:0; border:2px solid ${C.cyan}; }
        .btn { padding:10px 16px; border-radius:8px; border:none; cursor:pointer; font-size:13px; font-weight:600; transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif; }
        .btn-primary { background:${C.cyan}; color:#020A08; }
        .btn-primary:hover { background:#04EFB2; }
        .btn-ghost { background:transparent; border:1px solid ${C.border}; color:${C.text}; }
        .btn-ghost:hover { border-color:${C.borderHover}; background:rgba(255,255,255,0.05); }
        .filter-chip { padding:8px 16px; border-radius:100px; border:1px solid ${C.border}; background:transparent; color:${C.muted}; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .filter-chip.active { background:${C.cyanDim}; border-color:${C.cyan}; color:${C.cyan}; }
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
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textDecoration: "none" }}>
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
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, fontFamily: "Syne,sans-serif" }}>P</span>
          </div>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 18, color: C.text }}>Pactum</span>
        </Link>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span className="nav-link" onClick={() => router.push("/directorio")}>Directorio</span>
          <span className="nav-link" onClick={() => router.push("/matches")} style={{color: C.cyan}}>Mis matches</span>
          <span className="nav-link" onClick={() => router.push("/dashboard")}>Dashboard</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.cyan, marginBottom: 12 }}>
            Matching
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: "-0.03em", color: C.text, marginBottom: 8 }}>
                Mis Matches
              </h1>
              <p style={{ color: C.muted, fontSize: 16 }}>
                {matches.length} match{matches.length !== 1 ? "es" : ""} encontrado{matches.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={calculateMatches}
              disabled={calculatingMatches}
              className="btn btn-primary"
              style={{ opacity: calculatingMatches ? 0.6 : 1 }}
            >
              {calculatingMatches ? "Calculando..." : "🔄 Recalcular Matches"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${C.red}`, borderRadius: 8, padding: 16, marginBottom: 24, color: C.red, fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Filters */}
        <div style={{ marginBottom: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["pendiente", "aceptado", "rechazado", "all"].map((status) => (
            <button
              key={status}
              className={`filter-chip ${filterStatus === status ? "active" : ""}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === "all" ? "Todos" : status === "pendiente" ? "Pendientes" : status === "aceptado" ? "Aceptados" : "Rechazados"}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <p style={{ textAlign: "center", color: C.dimmed, fontSize: 16 }}>Cargando matches...</p>}

        {/* No matches */}
        {!loading && matches.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.dimmed }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: C.muted, marginBottom: 8 }}>
              No hay matches disponibles
            </p>
            <p style={{ fontSize: 14 }}>
              Intenta recalcular matches o actualiza tu perfil
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && matches.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 }}>
            {matches.map((match) => {
              const statusColors: Record<string, { bg: string; color: string }> = {
                pendiente: { bg: "rgba(251,191,36,0.12)", color: "#FBBF24" },
                aceptado: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
                rechazado: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
              };
              const colors = statusColors[match.estado] || statusColors.pendiente;
              return (
                <div key={match.id} className="match-card">
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#8B5CF6,#06D6A0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {match.other_user?.nombre?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    {/* Score */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 4 }}>
                        {match.other_user?.nombre || "Usuario"}
                      </h3>
                      <p style={{ fontSize: 13, color: C.dimmed }}>
                        {match.other_user?.ubicacion && `📍 ${match.other_user.ubicacion}`}
                      </p>
                    </div>
                    <div className="score-badge">{match.score}%</div>
                  </div>

                  {/* Bio */}
                  {match.other_user?.bio && (
                    <p
                      style={{
                        fontSize: 13,
                        color: C.muted,
                        lineHeight: 1.5,
                        marginBottom: 12,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {match.other_user.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {match.other_user?.skills && match.other_user.skills.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 11, color: C.dimmed, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>
                        Skills
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {match.other_user.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: `1px solid ${C.border}`,
                              borderRadius: 100,
                              padding: "4px 10px",
                              fontSize: 11,
                              color: C.dimmed,
                              fontWeight: 600,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div
                    style={{
                      background: colors.bg,
                      color: colors.color,
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 16,
                      display: "inline-block",
                    }}
                  >
                    {match.estado === "pendiente" ? "⏳ Pendiente" : match.estado === "aceptado" ? "✓ Aceptado" : "✗ Rechazado"}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
                    {match.estado === "pendiente" ? (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => updateMatchStatus(match.id, "aceptado")}
                          style={{ flex: 1 }}
                        >
                          Conectar
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => updateMatchStatus(match.id, "rechazado")}
                          style={{ flex: 1 }}
                        >
                          Rechazar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-ghost"
                          onClick={() => router.push(`/users/${match.other_user?.id}`)}
                          style={{ flex: 1 }}
                        >
                          Ver perfil
                        </button>
                        {match.estado === "aceptado" && (
                          <button
                            className="btn btn-primary"
                            onClick={() => router.push(`/chat/${match.id}`)}
                            style={{ flex: 1 }}
                          >
                            Chat
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
