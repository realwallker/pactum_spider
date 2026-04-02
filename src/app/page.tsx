"use client";

import { useState, useEffect } from "react";

const C = {
  bg: "#05060F",
  surface: "#0A0C1A",
  surfaceAlt: "#0E1022",
  card: "rgba(255,255,255,0.04)",
  cardHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  cyan: "#06D6A0",
  cyanDim: "rgba(6,214,160,0.12)",
  cyanGlow: "rgba(6,214,160,0.25)",
  amber: "#FBBF24",
  amberDim: "rgba(251,191,36,0.12)",
  violet: "#8B5CF6",
  violetDim: "rgba(139,92,246,0.12)",
  text: "#F1F5F9",
  muted: "#94A3B8",
  dimmed: "#475569",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { font-family:'Plus Jakarta Sans',sans-serif; background:${C.bg}; color:${C.text}; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation: fadeUp 0.7s ease both; }
  .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.7s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.7s 0.4s ease both; }
  .btn-primary {
    background: ${C.cyan}; color: #020A08; font-weight:700; border:none; cursor:pointer;
    padding:14px 28px; border-radius:10px; font-size:15px;
    font-family:'Plus Jakarta Sans',sans-serif;
    transition: all 0.2s; letter-spacing:-0.01em;
  }
  .btn-primary:hover { background:#04EFB2; transform:translateY(-1px); box-shadow:0 8px 32px rgba(6,214,160,0.35); }
  .btn-ghost {
    background:transparent; color:${C.text}; border:1px solid ${C.border};
    padding:13px 24px; border-radius:10px; font-size:15px; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s;
  }
  .btn-ghost:hover { border-color:${C.borderHover}; background:${C.card}; }
  .feature-card {
    background:${C.card}; border:1px solid ${C.border}; border-radius:16px;
    padding:28px; transition:all 0.3s; cursor:default;
  }
  .feature-card:hover { background:${C.cardHover}; border-color:${C.borderHover}; transform:translateY(-4px); }
  .step-num {
    width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:18px; font-family:'Syne',sans-serif;
  }
  .tag {
    display:inline-flex; align-items:center; gap:6px;
    background:${C.cyanDim}; color:${C.cyan}; border:1px solid rgba(6,214,160,0.2);
    padding:6px 14px; border-radius:100px; font-size:13px; font-weight:600;
  }
  .price-card {
    background:${C.card}; border:1px solid ${C.border}; border-radius:20px; padding:32px;
    transition:all 0.3s; position:relative;
  }
  .price-card:hover { border-color:${C.borderHover}; }
  .price-card.featured {
    background:linear-gradient(135deg,rgba(6,214,160,0.08),rgba(139,92,246,0.08));
    border-color:rgba(6,214,160,0.3);
  }
  .match-card {
    background:rgba(10,12,26,0.9); border:1px solid ${C.border};
    border-radius:14px; padding:16px 20px; backdrop-filter:blur(12px);
    min-width:220px;
  }
  .score-ring {
    width:48px; height:48px; border-radius:50%;
    border:2px solid ${C.cyan}; display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:14px; color:${C.cyan}; flex-shrink:0;
  }
  .nav-link { color:${C.muted}; text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; cursor:pointer; }
  .nav-link:hover { color:${C.text}; }
  .section-label { font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:${C.cyan}; }
  .divider { height:1px; background:${C.border}; }
  .orb1 {
    position:absolute; width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle,rgba(6,214,160,0.12),transparent 70%);
    top:-200px; right:-100px; pointer-events:none;
  }
  .orb2 {
    position:absolute; width:500px; height:500px; border-radius:50%;
    background:radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%);
    bottom:-100px; left:-150px; pointer-events:none;
  }
  .check-item { display:flex; align-items:center; gap:10px; font-size:14px; color:${C.muted}; padding:4px 0; }
  .check { width:18px; height:18px; border-radius:50%; background:${C.cyanDim}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  @media(max-width:768px) {
    .hide-mobile { display:none !important; }
  }
`;

interface MatchCardProps {
  name: string;
  role: string;
  city: string;
  score: number;
  delay: number;
  className?: string;
}

function MatchCard({
  name,
  role,
  city,
  score,
  delay,
  className,
}: MatchCardProps) {
  return (
    <div
      className={`match-card ${className || ""}`}
      style={{
        animation: `float ${6 + delay}s ease-in-out ${delay}s infinite`,
      }}
    >
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
            fontSize: 15,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{name}</p>
          <p style={{ fontSize: 12, color: C.muted }}>{role}</p>
        </div>
        <div className="score-ring" style={{ marginLeft: "auto" }}>
          {score}%
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.cyan,
            animation: "pulse 2s infinite",
          }}
        />
        <span style={{ fontSize: 12, color: C.dimmed }}>{city}</span>
        <span
          style={{
            fontSize: 12,
            marginLeft: "auto",
            background: C.cyanDim,
            color: C.cyan,
            padding: "2px 8px",
            borderRadius: 100,
            fontWeight: 600,
          }}
        >
          Match
        </span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: "◉",
    color: C.cyan,
    colorDim: C.cyanDim,
    title: "Directorio inteligente",
    desc: "Explora cientos de proyectos activos en Ecuador. Filtra por sector, etapa y tipo de vacante. Aplica en segundos.",
    tags: ["Búsqueda avanzada", "Filtros en vivo", "Sin registro"],
  },
  {
    icon: "◈",
    color: C.violet,
    colorDim: C.violetDim,
    title: "Matching complementario",
    desc: "La IA no busca gente igual a ti — busca quien te complementa. Un biólogo con un ingeniero. Un creativo con un técnico.",
    tags: ["Score de compatibilidad", "Algoritmo propio", "OpenAI embeddings"],
  },
  {
    icon: "◇",
    color: C.amber,
    colorDim: C.amberDim,
    title: "Sala de colaboración",
    desc: "Acepta un match y accede a tu sala privada con chat en tiempo real, documentos compartidos y gestión de tareas.",
    tags: ["Chat en tiempo real", "Documentos", "Gestión de tareas"],
  },
];

const steps = [
  {
    n: "01",
    title: "Crea tu perfil",
    desc: "Define tus habilidades, intereses y ciudad. En menos de 5 minutos el sistema ya está analizando tu perfil.",
  },
  {
    n: "02",
    title: "Recibe matches",
    desc: "El algoritmo identifica perfiles complementarios y te muestra un score de compatibilidad entre 0 y 100.",
  },
  {
    n: "03",
    title: "Conecta y construye",
    desc: "Acepta el match, accede a tu sala privada y empieza a construir junto a tu nuevo socio.",
  },
];

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "Para explorar la plataforma",
    items: [
      "3 solicitudes de match/mes",
      "Acceso al directorio",
      "Perfil público",
      "Onboarding guiado",
    ],
    cta: "Comenzar gratis",
    featured: false,
  },
  {
    name: "Pro",
    price: 19,
    desc: "Para emprendedores activos",
    items: [
      "Matching ilimitado",
      "Sala de trabajo privada",
      "Chat en tiempo real",
      "Notificaciones push y email",
      "Badge verificado",
    ],
    cta: "Comenzar Pro →",
    featured: true,
  },
  {
    name: "Scale",
    price: 49,
    desc: "Para equipos y startups",
    items: [
      "Todo lo de Pro",
      "Analytics avanzados",
      "Hasta 5 proyectos activos",
      "Soporte prioritario",
      "API access",
    ],
    cta: "Contactar",
    featured: false,
  },
];

export default function PactumLanding() {
  const handleStart = () => (window.location.href = "/login");
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(1);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{css}</style>

      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(5,6,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg,${C.cyan},${C.violet})`,
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
              fontSize: 20,
              letterSpacing: "-0.03em",
              color: C.text,
            }}
          >
            Pactum
          </span>
        </div>
        <div
          className="hide-mobile"
          style={{ display: "flex", gap: 32, alignItems: "center" }}
        >
          {["Proyectos", "Matching", "Precios", "Blog"].map((l) => (
            <a key={l} className="nav-link">
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="btn-ghost hide-mobile"
            style={{ padding: "9px 18px", fontSize: 14 }}
            onClick={handleStart}
          >
            Ingresar
          </button>
          <button
            className="btn-primary"
            style={{ padding: "9px 18px", fontSize: 14 }}
            onClick={handleStart}
          >
            Comenzar →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "80px 32px 64px",
          minHeight: 680,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="orb1" />
        <div className="orb2" />
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 64,
            flexWrap: "wrap",
          }}
        >
          {/* Left */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <div className="tag fade-up" style={{ marginBottom: 24 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.cyan,
                  animation: "pulse 2s infinite",
                }}
              />
              Plataforma activa · Ecuador 🇪🇨
            </div>
            <h1
              className="fade-up-1"
              style={{
                fontFamily: "Syne,sans-serif",
                fontWeight: 800,
                fontSize: "clamp(38px,5vw,62px)",
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
                marginBottom: 24,
                color: C.text,
              }}
            >
              Tu próximo socio
              <br />
              <span style={{ color: C.cyan }}>te está buscando.</span>
            </h1>
            <p
              className="fade-up-2"
              style={{
                fontSize: 18,
                color: C.muted,
                lineHeight: 1.65,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              Pactum conecta emprendedores con habilidades complementarias. El
              algoritmo hace el match — tú construyes el negocio.
            </p>
            <div
              className="fade-up-3"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <button
                className="btn-primary"
                style={{ fontSize: 16, padding: "15px 32px" }}
                onClick={handleStart}
              >
                Empieza gratis
              </button>
              <button className="btn-ghost" style={{ fontSize: 15 }}>
                Ver cómo funciona →
              </button>
            </div>
            <div
              style={{
                marginTop: 48,
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                ["500+", "proyectos activos"],
                ["2,000+", "emprendedores"],
                ["94%", "satisfacción"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p
                    style={{
                      fontFamily: "Syne,sans-serif",
                      fontWeight: 800,
                      fontSize: 28,
                      letterSpacing: "-0.03em",
                      color: C.text,
                    }}
                  >
                    {n}
                  </p>
                  <p style={{ fontSize: 13, color: C.dimmed, marginTop: 2 }}>
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating match cards */}
          <div
            className="hide-mobile"
            style={{
              flex: 1,
              position: "relative",
              minHeight: 420,
              minWidth: 320,
            }}
          >
            <div style={{ position: "absolute", top: 20, left: 20 }}>
              <MatchCard
                name="María G."
                role="Biotecnología · PhD"
                city="Quito"
                score={94}
                delay={0}
              />
            </div>
            <div style={{ position: "absolute", top: 140, right: 0 }}>
              <MatchCard
                name="Carlos V."
                role="Ingeniería de Sistemas"
                city="Guayaquil"
                score={87}
                delay={2}
              />
            </div>
            <div style={{ position: "absolute", bottom: 40, left: 40 }}>
              <MatchCard
                name="Ana R."
                role="Marketing Digital"
                city="Cuenca"
                score={81}
                delay={1}
              />
            </div>
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                opacity: 0.2,
              }}
              viewBox="0 0 400 400"
            >
              <line
                x1="160"
                y1="80"
                x2="280"
                y2="180"
                stroke={C.cyan}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="160"
                y1="80"
                x2="120"
                y2="280"
                stroke={C.violet}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="280"
                y1="180"
                x2="120"
                y2="280"
                stroke={C.amber}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="divider" style={{ maxWidth: 1120, margin: "0 auto" }} />

      {/* FEATURES */}
      <section
        style={{ padding: "96px 32px", maxWidth: 1120, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p className="section-label" style={{ marginBottom: 16 }}>
            Funcionalidades
          </p>
          <h2
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px,4vw,44px)",
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Todo lo que necesitas para conectar
          </h2>
          <p
            style={{
              color: C.muted,
              fontSize: 17,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Desde el descubrimiento hasta la colaboración — en una sola
            plataforma.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: f.colorDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  color: f.color,
                  marginBottom: 20,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 10,
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: C.muted,
                  fontSize: 15,
                  lineHeight: 1.65,
                  marginBottom: 20,
                }}
              >
                {f.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {f.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: C.surfaceAlt,
                      border: `1px solid ${C.border}`,
                      borderRadius: 100,
                      padding: "4px 12px",
                      fontSize: 12,
                      color: C.dimmed,
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          background: C.surface,
          padding: "96px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="orb2" style={{ opacity: 0.6 }} />
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>
              Cómo funciona
            </p>
            <h2
              style={{
                fontFamily: "Syne,sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px,4vw,44px)",
                letterSpacing: "-0.03em",
              }}
            >
              Tres pasos para tu mejor match
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 40,
            }}
          >
            {steps.map((s, i) => (
              <div key={s.n}>
                <div
                  className="step-num"
                  style={{
                    background:
                      i === 0 ? C.cyanDim : i === 1 ? C.violetDim : C.amberDim,
                    color: i === 0 ? C.cyan : i === 1 ? C.violet : C.amber,
                    marginBottom: 20,
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    marginBottom: 12,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        style={{ padding: "96px 32px", maxWidth: 1120, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p className="section-label" style={{ marginBottom: 16 }}>
            Precios
          </p>
          <h2
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px,4vw,44px)",
              letterSpacing: "-0.03em",
              marginBottom: 24,
            }}
          >
            Simple. Transparente. Sin sorpresas.
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 100,
              padding: "6px 6px 6px 16px",
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: annual ? C.dimmed : C.text,
                fontWeight: 600,
              }}
            >
              Mensual
            </span>
            <div
              onClick={() => setAnnual(!annual)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 100,
                background: annual ? C.cyan : C.surfaceAlt,
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: annual ? 22 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 14,
                color: annual ? C.text : C.dimmed,
                fontWeight: 600,
              }}
            >
              Anual
            </span>
            <span
              style={{
                background: C.cyanDim,
                color: C.cyan,
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 100,
              }}
            >
              -20%
            </span>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`price-card ${p.featured ? "featured" : ""}`}
              onMouseEnter={() => setHoveredPlan(i)}
              style={{
                transform: hoveredPlan === i ? "translateY(-6px)" : "none",
              }}
            >
              {p.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: C.cyan,
                    color: "#020A08",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 16px",
                    borderRadius: 100,
                    whiteSpace: "nowrap",
                  }}
                >
                  Más popular
                </div>
              )}
              <p
                style={{
                  fontSize: 14,
                  color: C.muted,
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {p.name}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: 40,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: C.text,
                  }}
                >
                  ${annual ? Math.round(p.price * 0.8) : p.price}
                </span>
                <span style={{ fontSize: 14, color: C.dimmed }}>/mes</span>
              </div>
              <p style={{ fontSize: 13, color: C.dimmed, marginBottom: 28 }}>
                {p.desc}
              </p>
              <div className="divider" style={{ marginBottom: 24 }} />
              {p.items.map((item) => (
                <div key={item} className="check-item">
                  <div className="check">
                    <span
                      style={{ color: C.cyan, fontSize: 10, fontWeight: 900 }}
                    >
                      ✓
                    </span>
                  </div>
                  {item}
                </div>
              ))}
              <button
                className={p.featured ? "btn-primary" : "btn-ghost"}
                style={{ width: "100%", marginTop: 28, textAlign: "center" }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{ padding: "80px 32px", maxWidth: 1120, margin: "0 auto" }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(6,214,160,0.1),rgba(139,92,246,0.1))",
            border: "1px solid rgba(6,214,160,0.2)",
            borderRadius: 24,
            padding: "64px 48px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px,4vw,48px)",
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Tu próximo proyecto empieza hoy.
          </h2>
          <p
            style={{
              color: C.muted,
              fontSize: 17,
              marginBottom: 36,
              maxWidth: 440,
              margin: "0 auto 36px",
            }}
          >
            Únete a los emprendedores que ya están construyendo algo grande en
            Ecuador.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-primary"
              style={{ fontSize: 16, padding: "15px 36px" }}
              onClick={handleStart}
            >
              Crear cuenta gratis
            </button>
            <button className="btn-ghost" style={{ fontSize: 15 }}>
              Ver proyectos →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{ borderTop: `1px solid ${C.border}`, padding: "40px 32px" }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: `linear-gradient(135deg,${C.cyan},${C.violet})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 13,
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
                fontSize: 16,
                color: C.text,
              }}
            >
              Pactum
            </span>
          </div>
          <p style={{ fontSize: 13, color: C.dimmed }}>
            © 2026 Pactum · Hecho en Ecuador 🇪🇨
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacidad", "Términos", "Soporte"].map((l) => (
              <a key={l} className="nav-link" style={{ fontSize: 13 }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
