"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project, ProjectStage, Vacancy as VacancyType } from "@/lib/types";

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
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.12)",
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

interface VacancyForm {
  id?: string;
  project_id?: string;
  titulo: string;
  descripcion: string | null;
  skills_requeridas: string[];
  estado: "abierta" | "cerrada";
  _isNew?: boolean;
}

export default function EditProjectClient({
  project,
  projectId,
}: {
  project: Project;
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    nombre: project.nombre,
    descripcion: project.descripcion,
    sector: project.sector,
    etapa: project.etapa,
  });

  const [vacancies, setVacancies] = useState<VacancyForm[]>(
    (project.vacancies || []).map((v: VacancyType) => ({
      id: v.id,
      titulo: v.titulo,
      descripcion: v.descripcion,
      skills_requeridas: v.skills_requeridas || [],
      estado: v.estado || "abierta",
      _isNew: false,
    })),
  );

  const addVacancy = () => {
    setVacancies((v) => [
      ...v,
      {
        titulo: "",
        descripcion: "",
        skills_requeridas: [],
        estado: "abierta",
        _isNew: true,
      },
    ]);
  };

  const removeVacancy = (idx: number) => {
    setVacancies((v) => v.filter((_, i) => i !== idx));
  };

  const updateVacancy = (idx: number, field: string, value: string | string[]) => {
    setVacancies((v) =>
      v.map((vac, i) => (i === idx ? { ...vac, [field]: value } : vac)),
    );
  };

  const toggleSkill = (idx: number, skill: string) => {
    updateVacancy(
      idx,
      "skills_requeridas",
      vacancies[idx].skills_requeridas.includes(skill)
        ? vacancies[idx].skills_requeridas.filter((s) => s !== skill)
        : [...vacancies[idx].skills_requeridas, skill],
    );
  };

  const submit = async () => {
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.descripcion || !form.descripcion.trim() || form.descripcion.length < 80) {
      setError(
        `La descripción necesita al menos 80 caracteres (tienes ${form.descripcion?.length || 0})`,
      );
      return;
    }
    if (!form.sector) {
      setError("Selecciona un sector");
      return;
    }

    // Validar vacantes
    for (let i = 0; i < vacancies.length; i++) {
      const v = vacancies[i];
      if (!v.titulo.trim()) {
        setError(`Vacante ${i + 1}: Escribe el título del rol`);
        return;
      }
      if (!v.descripcion || !v.descripcion.trim() || v.descripcion.length < 50) {
        setError(
          `Vacante ${i + 1}: La descripción necesita al menos 50 caracteres`,
        );
        return;
      }
      if (v.skills_requeridas.length === 0) {
        setError(`Vacante ${i + 1}: Selecciona al menos una skill`);
        return;
      }
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Actualizar proyecto
      const updateRes = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          sector: form.sector,
          etapa: form.etapa,
        }),
      });

      if (!updateRes.ok) {
        const data = await updateRes.json();
        throw new Error(data.error || "Error al actualizar proyecto");
      }

      // TODO: Gestionar vacantes (actualizar, crear, eliminar)
      // Por ahora solo actualizamos el proyecto principal
      // Las vacantes se pueden editar en una próxima versión

      setSuccess("✓ Proyecto actualizado correctamente");
      setTimeout(() => {
        router.push("/projects");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
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
        input, textarea, select {
          background: ${C.card}; border: 1px solid ${C.border}; color: ${C.text};
          padding: 12px 16px; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; transition: border 0.2s; width: 100%;
        }
        input:focus, textarea:focus, select:focus {
          outline: none; border-color: ${C.cyan};
        }
        input::placeholder, textarea::placeholder {
          color: ${C.dimmed};
        }
        label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
        .form-group { margin-bottom: 24px; }
        .btn { border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; border-radius: 8px; transition: all 0.2s; font-size: 14px;
          padding: 12px 24px;
        }
        .btn-primary { background: ${C.cyan}; color: #020A08; }
        .btn-primary:hover { background: #04EFB2; }
        .btn-secondary { background: ${C.card}; border: 1px solid ${C.border}; color: ${C.text}; }
        .btn-secondary:hover { background: ${C.cardHover}; }
        .btn-danger { background: ${C.redDim}; color: ${C.red}; border: 1px solid rgba(239,68,68,0.3); }
        .btn-danger:hover { background: rgba(239,68,68,0.2); }
        .skill-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
        .skill-checkbox {
          display: flex; align-items: center; padding: 10px; border: 1px solid ${C.border};
          border-radius: 8px; cursor: pointer; transition: all 0.2s; background: ${C.surface};
        }
        .skill-checkbox input { width: auto; margin-right: 8px; cursor: pointer; }
        .skill-checkbox:has(input:checked) {
          background: ${C.cyanDim}; border-color: ${C.cyan};
        }
        .error { background: ${C.redDim}; border: 1px solid ${C.red}; color: ${C.red};
          padding: 16px; border-radius: 10px; margin-bottom: 20px; font-size: 14px; }
        .success { background: rgba(6,214,160,0.1); border: 1px solid ${C.cyan}; color: ${C.cyan};
          padding: 16px; border-radius: 10px; margin-bottom: 20px; font-size: 14px; }
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
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
                fontFamily: "Syne",
              }}
            >
              P
            </span>
          </div>
          <span
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "-0.03em",
            }}
          >
            Pactum
          </span>
        </div>
        <Link
          href="/projects"
          style={{ color: C.muted, textDecoration: "none" }}
        >
          ← Volver
        </Link>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Editar Proyecto
        </h1>
        <p style={{ color: C.muted, marginBottom: 32 }}>
          Actualiza la información de tu proyecto
        </p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* FORM */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 32,
          }}
        >
          <div className="form-group">
            <label>Nombre del Proyecto</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) =>
                setForm((p) => ({ ...p, nombre: e.target.value }))
              }
              placeholder="Ej: Plataforma de educación online"
            />
          </div>

          <div className="form-group">
            <label>Descripción (mínimo 80 caracteres)</label>
            <textarea
              rows={4}
              value={form.descripcion || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, descripcion: e.target.value }))
              }
              placeholder="Describe tu proyecto..."
            />
            <p style={{ fontSize: 12, color: C.dimmed, marginTop: 4 }}>
              {(form.descripcion || "").length} / 80 caracteres
            </p>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            <div className="form-group">
              <label>Sector</label>
              <select
                value={form.sector || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sector: e.target.value }))
                }
              >
                <option value="">Selecciona un sector</option>
                {SECTORES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Etapa del Proyecto</label>
              <select
                value={form.etapa}
                onChange={(e) =>
                  setForm((p) => ({ ...p, etapa: e.target.value as ProjectStage }))
                }
              >
                <option value="idea">💡 Idea</option>
                <option value="mvp">🚀 MVP</option>
                <option value="crecimiento">📈 Crecimiento</option>
              </select>
            </div>
          </div>

          {/* VACANCIES SECTION */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 32,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
              Vacantes ({vacancies.length})
            </h2>

            {vacancies.map((vacancy, idx) => (
              <div
                key={idx}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
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
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                    Vacante {idx + 1}
                  </h3>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeVacancy(idx)}
                    style={{ padding: "8px 12px", fontSize: 12 }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Título del Rol</label>
                    <input
                      type="text"
                      value={vacancy.titulo}
                      onChange={(e) =>
                        updateVacancy(idx, "titulo", e.target.value)
                      }
                      placeholder="Ej: Desarrollador Full-Stack"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Estado</label>
                    <select
                      value={vacancy.estado}
                      onChange={(e) =>
                        updateVacancy(
                          idx,
                          "estado",
                          e.target.value as "abierta" | "cerrada",
                        )
                      }
                    >
                      <option value="abierta">Abierta</option>
                      <option value="cerrada">Cerrada</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label>Descripción (mínimo 50 caracteres)</label>
                  <textarea
                    rows={3}
                    value={vacancy.descripcion || ""}
                    onChange={(e) =>
                      updateVacancy(idx, "descripcion", e.target.value)
                    }
                    placeholder="Describe los requisitos y responsabilidades..."
                  />
                  <p style={{ fontSize: 12, color: C.dimmed, marginTop: 4 }}>
                    {(vacancy.descripcion || "").length} / 50 caracteres
                  </p>
                </div>

                <label style={{ display: "block", marginBottom: 12 }}>
                  Skills Requeridas
                </label>
                <div className="skill-grid">
                  {SKILLS_OPTIONS.map((skill) => (
                    <label key={skill} className="skill-checkbox">
                      <input
                        type="checkbox"
                        checked={vacancy.skills_requeridas.includes(skill)}
                        onChange={() => toggleSkill(idx, skill)}
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="btn btn-secondary"
              onClick={addVacancy}
              style={{ width: "100%", marginBottom: 20 }}
            >
              + Agregar vacante
            </button>
          </div>

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 32,
              paddingTop: 32,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Guardando..." : "✓ Guardar cambios"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/projects")}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
