"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const C = {
  bg: "#05060F",
  surface: "#0A0C1A",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.18)",
  cyan: "#06D6A0",
  cyanDim: "rgba(6,214,160,0.12)",
  violet: "#8B5CF6",
  violetDim: "rgba(139,92,246,0.12)",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

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
  "Fotografía y video",
  "Arquitectura",
  "Medicina y salud",
  "Educación",
  "Logística",
];

const INTERESTS_OPTIONS = [
  "Tecnología",
  "Salud",
  "Educación",
  "Agro",
  "Fintech",
  "E-commerce",
  "Sostenibilidad",
  "Arte y cultura",
  "Turismo",
  "Construcción",
  "Alimentos",
  "Moda",
  "Deporte",
  "Transporte",
];

const CIUDADES = [
  "Guayaquil",
  "Quito",
  "Cuenca",
  "Manta",
  "Ambato",
  "Portoviejo",
  "Loja",
  "Ibarra",
  "Santo Domingo",
  "Otra",
];

const STEPS = ["Perfil básico", "Tus habilidades", "Tus intereses"];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    bio: "",
    skills: [] as string[],
    intereses: [] as string[],
  });

  const toggleItem = (list: "skills" | "intereses", item: string) => {
    setForm((prev) => ({
      ...prev,
      [list]: prev[list].includes(item)
        ? prev[list].filter((s) => s !== item)
        : [...prev[list], item],
    }));
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.nombre.trim()) return "Escribe tu nombre";
      if (!form.ubicacion) return "Selecciona tu ciudad";
      if (form.bio.trim().length < 50)
        return `La bio necesita al menos 50 caracteres (tienes ${form.bio.trim().length})`;
    }
    if (step === 1 && form.skills.length < 3)
      return "Selecciona al menos 3 habilidades";
    if (step === 2 && form.intereses.length < 2)
      return "Selecciona al menos 2 intereses";
    return "";
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    submit();
  };

  const submit = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error: dbError } = await supabase
      .from("users")
      .update({
        nombre: form.nombre.trim(),
        ubicacion: form.ubicacion,
        bio: form.bio.trim(),
        skills: form.skills,
        intereses: form.intereses,
      })
      .eq("id", user.id);

    if (dbError) {
      setError("Error guardando. Intenta de nuevo.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        input, select, textarea {
          width:100%; background:rgba(255,255,255,0.05); border:1px solid ${C.border};
          border-radius:10px; padding:12px 16px; color:${C.text}; font-size:15px;
          font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:border 0.2s;
          resize:none;
        }
        input:focus, select:focus, textarea:focus { border-color:${C.cyan}; }
        input::placeholder, textarea::placeholder { color:${C.dimmed}; }
        select option { background:#0A0C1A; }
        .chip {
          padding:8px 16px; border-radius:100px; border:1px solid ${C.border};
          background:transparent; color:${C.muted}; font-size:13px; font-weight:600;
          cursor:pointer; transition:all 0.15s; font-family:'Plus Jakarta Sans',sans-serif;
          white-space:nowrap;
        }
        .chip:hover { border-color:${C.borderHover}; color:${C.text}; }
        .chip.active { background:${C.cyanDim}; border-color:rgba(6,214,160,0.4); color:${C.cyan}; }
        .chip.active-v { background:${C.violetDim}; border-color:rgba(139,92,246,0.4); color:${C.violet}; }
        .btn-primary {
          background:${C.cyan}; color:#020A08; font-weight:700; border:none; cursor:pointer;
          padding:14px 28px; border-radius:10px; font-size:15px; width:100%;
          font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background:#04EFB2; }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
        label { font-size:13px; font-weight:600; color:${C.muted}; display:block; margin-bottom:8px; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
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
                fontSize: 17,
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
              fontSize: 22,
              color: C.text,
              letterSpacing: "-0.03em",
            }}
          >
            Pactum
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            {STEPS.map((s, i) => (
              <div
                key={s}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: i <= step ? C.cyan : "rgba(255,255,255,0.08)",
                    color: i <= step ? "#020A08" : C.dimmed,
                    fontSize: 11,
                    fontWeight: 800,
                    transition: "all 0.3s",
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: i === step ? C.text : C.dimmed,
                    fontWeight: i === step ? 600 : 400,
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 100,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: C.cyan,
                borderRadius: 100,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "36px 32px",
          }}
        >
          {/* STEP 0 — Perfil básico */}
          {step === 0 && (
            <div>
              <h2
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                  color: C.text,
                }}
              >
                Cuéntanos sobre ti
              </h2>
              <p
                style={{
                  color: C.muted,
                  fontSize: 15,
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Esta información ayuda al algoritmo a encontrarte el match
                perfecto.
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <div>
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ej: María García"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nombre: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>Ciudad</label>
                  <select
                    value={form.ubicacion}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, ubicacion: e.target.value }))
                    }
                  >
                    <option value="">Selecciona tu ciudad</option>
                    {CIUDADES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>
                    Tu bio{" "}
                    <span style={{ color: C.dimmed, fontWeight: 400 }}>
                      — mínimo 50 caracteres ({form.bio.length}/50)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos quién eres, qué construyes y qué buscas en un socio..."
                    value={form.bio}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, bio: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Skills */}
          {step === 1 && (
            <div>
              <h2
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                  color: C.text,
                }}
              >
                ¿Cuáles son tus habilidades?
              </h2>
              <p
                style={{
                  color: C.muted,
                  fontSize: 15,
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Selecciona al menos 3. El algoritmo busca perfiles que te{" "}
                <strong style={{ color: C.text }}>complementen</strong>, no que
                sean iguales.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SKILLS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`chip ${form.skills.includes(s) ? "active" : ""}`}
                    onClick={() => toggleItem("skills", s)}
                  >
                    {form.skills.includes(s) ? "✓ " : ""}
                    {s}
                  </button>
                ))}
              </div>
              <p
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  color: form.skills.length >= 3 ? C.cyan : C.dimmed,
                }}
              >
                {form.skills.length} seleccionadas{" "}
                {form.skills.length >= 3 ? "✓" : `(mínimo 3)`}
              </p>
            </div>
          )}

          {/* STEP 2 — Intereses */}
          {step === 2 && (
            <div>
              <h2
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                  color: C.text,
                }}
              >
                ¿Qué sectores te apasionan?
              </h2>
              <p
                style={{
                  color: C.muted,
                  fontSize: 15,
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Selecciona los sectores donde quieres construir algo. Mínimo 2.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {INTERESTS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`chip ${form.intereses.includes(s) ? "active-v" : ""}`}
                    onClick={() => toggleItem("intereses", s)}
                  >
                    {form.intereses.includes(s) ? "✓ " : ""}
                    {s}
                  </button>
                ))}
              </div>
              <p
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  color: form.intereses.length >= 2 ? C.violet : C.dimmed,
                }}
              >
                {form.intereses.length} seleccionados{" "}
                {form.intereses.length >= 2 ? "✓" : `(mínimo 2)`}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "rgba(226,75,74,0.12)",
                border: "1px solid rgba(226,75,74,0.3)",
                borderRadius: 10,
                color: "#F87171",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {step > 0 && (
              <button
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.muted,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                ← Atrás
              </button>
            )}
            <button
              className="btn-primary"
              onClick={next}
              disabled={loading}
              style={{ flex: 2 }}
            >
              {loading
                ? "Guardando..."
                : step === 2
                  ? "¡Empezar a hacer match! →"
                  : "Continuar →"}
            </button>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: C.dimmed,
          }}
        >
          Puedes editar esto después desde tu perfil
        </p>
      </div>
    </div>
  );
}
