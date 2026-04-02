"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const C = {
  bg: "#05060F",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  cyan: "#06D6A0",
  cyanDim: "rgba(6,214,160,0.12)",
  violet: "#8B5CF6",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

const SECTORES = [
  "Tecnología",
  "Salud",
  "Educación",
  "Agro",
  "Sostenibilidad",
  "Fintech",
  "E-commerce",
  "Construcción",
  "Moda",
  "Alimentos",
  "Turismo",
  "Otro",
];
const SKILLS_OPTIONS = [
  "Desarrollo de software",
  "Diseño UX/UI",
  "Marketing digital",
  "Finanzas y contabilidad",
  "Ventas",
  "Biotecnología",
  "Agronomía",
  "Ingeniería mecánica",
  "Inteligencia artificial",
  "Legal y compliance",
  "Operaciones",
  "Recursos humanos",
  "Educación",
  "Logística",
];

interface Vacancy {
  titulo: string;
  descripcion: string;
  skills: string[];
}

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    sector: "",
    etapa: "idea",
  });
  const [vacancies, setVacancies] = useState<Vacancy[]>([
    { titulo: "", descripcion: "", skills: [] },
  ]);

  const addVacancy = () =>
    setVacancies((v) => [...v, { titulo: "", descripcion: "", skills: [] }]);
  const removeVacancy = (i: number) =>
    setVacancies((v) => v.filter((_, idx) => idx !== i));
  const updateVacancy = (i: number, field: string, value: string | string[]) =>
    setVacancies((v) =>
      v.map((vac, idx) => (idx === i ? { ...vac, [field]: value } : vac)),
    );
  const toggleSkill = (i: number, skill: string) =>
    updateVacancy(
      i,
      "skills",
      vacancies[i].skills.includes(skill)
        ? vacancies[i].skills.filter((s) => s !== skill)
        : [...vacancies[i].skills, skill],
    );

  const submit = async () => {
    if (!form.nombre.trim()) {
      setError("El nombre del proyecto es obligatorio");
      return;
    }
    if (!form.descripcion.trim() || form.descripcion.length < 80) {
      setError(
        `La descripción necesita al menos 80 caracteres (tienes ${form.descripcion.length})`,
      );
      return;
    }
    if (!form.sector) {
      setError("Selecciona un sector");
      return;
    }
    if (vacancies.some((v) => !v.titulo.trim())) {
      setError("Todas las vacantes necesitan un título");
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: project, error: projError } = await supabase
      .from("projects")
      .insert({
        owner_id: user.id,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        sector: form.sector,
        etapa: form.etapa,
        estado: "activo",
      })
      .select()
      .single();

    if (projError || !project) {
      setError("Error creando proyecto. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    const validVacancies = vacancies.filter((v) => v.titulo.trim());
    if (validVacancies.length > 0) {
      await supabase.from("vacancies").insert(
        validVacancies.map((v) => ({
          project_id: project.id,
          titulo: v.titulo.trim(),
          descripcion: v.descripcion.trim(),
          skills_requeridas: v.skills,
          estado: "abierta",
        })),
      );
    }

    // Mostrar éxito y redirigir
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(`/projects/${project.id}`);
    }, 1500);
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
        input, select, textarea { width:100%; background:rgba(255,255,255,0.05); border:1px solid ${C.border}; border-radius:10px; padding:12px 16px; color:${C.text}; font-size:15px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border 0.2s; resize:none; }
        input:focus, select:focus, textarea:focus { border-color:${C.cyan}; }
        input::placeholder, textarea::placeholder { color:${C.dimmed}; }
        select option { background:#0A0C1A; }
        label { font-size:13px; font-weight:600; color:${C.muted}; display:block; margin-bottom:8px; }
        .skill-chip { padding:6px 14px; border-radius:100px; border:1px solid ${C.border}; background:transparent; color:${C.muted}; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:'Plus Jakarta Sans',sans-serif; }
        .skill-chip.on { background:${C.cyanDim}; border-color:rgba(6,214,160,0.35); color:${C.cyan}; }
      `}</style>

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
        <span
          style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color: C.text,
          }}
        >
          Publicar proyecto
        </span>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
        <h1
          style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: "-0.03em",
            color: C.text,
            marginBottom: 8,
          }}
        >
          Tu proyecto
        </h1>
        <p style={{ color: C.muted, fontSize: 16, marginBottom: 40 }}>
          Cuéntanos qué estás construyendo y qué perfiles buscas.
        </p>

        {/* Datos básicos */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "28px",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: C.text,
              marginBottom: 20,
            }}
          >
            Información básica
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label>Nombre del proyecto</label>
              <input
                placeholder="Ej: AgroTech Ecuador"
                value={form.nombre}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nombre: e.target.value }))
                }
              />
            </div>
            <div>
              <label>
                Descripción{" "}
                <span style={{ color: C.dimmed, fontWeight: 400 }}>
                  ({form.descripcion.length}/500, mínimo 80)
                </span>
              </label>
              <textarea
                rows={5}
                maxLength={500}
                placeholder="¿Qué problema resuelves? ¿En qué etapa estás? ¿Qué hace diferente a tu proyecto?"
                value={form.descripcion}
                onChange={(e) =>
                  setForm((p) => ({ ...p, descripcion: e.target.value }))
                }
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label>Sector</label>
                <select
                  value={form.sector}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sector: e.target.value }))
                  }
                >
                  <option value="">Selecciona...</option>
                  {SECTORES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Etapa actual</label>
                <select
                  value={form.etapa}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, etapa: e.target.value }))
                  }
                >
                  <option value="idea">💡 Idea</option>
                  <option value="mvp">🚀 MVP</option>
                  <option value="crecimiento">📈 Crecimiento</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Vacantes */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: 16, color: C.text }}>
              Vacantes que buscas
            </h2>
            <button
              onClick={addVacancy}
              style={{
                background: C.cyanDim,
                border: "1px solid rgba(6,214,160,0.3)",
                borderRadius: 8,
                padding: "7px 14px",
                color: C.cyan,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            >
              + Agregar vacante
            </button>
          </div>
          {vacancies.map((v, i) => (
            <div
              key={i}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "24px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                  Vacante {i + 1}
                </span>
                {vacancies.length > 1 && (
                  <button
                    onClick={() => removeVacancy(i)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: C.dimmed,
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label>Título del rol</label>
                  <input
                    placeholder="Ej: CTO / Lead Developer"
                    value={v.titulo}
                    onChange={(e) => updateVacancy(i, "titulo", e.target.value)}
                  />
                </div>
                <div>
                  <label>Descripción del rol</label>
                  <textarea
                    rows={3}
                    placeholder="¿Qué hará esta persona? ¿Qué buscas?"
                    value={v.descripcion}
                    onChange={(e) =>
                      updateVacancy(i, "descripcion", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Skills que necesitas</label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    {SKILLS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        className={`skill-chip ${v.skills.includes(s) ? "on" : ""}`}
                        onClick={() => toggleSkill(i, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {success && (
          <div
            style={{
              marginBottom: 20,
              padding: "18px 20px",
              background: "rgba(6,214,160,0.12)",
              border: "1px solid rgba(6,214,160,0.35)",
              borderRadius: 10,
              color: "#06D6A0",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 18 }}>✓</span>
            <span>¡Proyecto publicado exitosamente! Redirigiendo...</span>
          </div>
        )}

        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 16px",
              background: "rgba(226,75,74,0.12)",
              border: "1px solid rgba(226,75,74,0.25)",
              borderRadius: 10,
              color: "#F87171",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading || success}
          style={{
            width: "100%",
            background: C.cyan,
            color: "#020A08",
            fontWeight: 700,
            border: "none",
            cursor: loading || success ? "not-allowed" : "pointer",
            padding: "15px",
            borderRadius: 12,
            fontSize: 16,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            opacity: loading || success ? 0.7 : 1,
          }}
        >
          {success
            ? "✓ Publicado"
            : loading
              ? "Publicando..."
              : "Publicar proyecto →"}
        </button>
      </div>
    </div>
  );
}
