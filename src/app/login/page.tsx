"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const signInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
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
                fontSize: 18,
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
              fontSize: 24,
              color: "#F1F5F9",
              letterSpacing: "-0.03em",
            }}
          >
            Pactum
          </span>
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#F1F5F9",
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Bienvenido de vuelta
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#94A3B8",
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          Conecta con emprendedores que te complementan
        </p>

        {/* Google Button */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: loading
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.06)",
            color: "#F1F5F9",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            transition: "all 0.2s",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {/* Google icon SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Conectando..." : "Continuar con Google"}
        </button>

        <p
          style={{
            marginTop: 28,
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          Al continuar aceptas nuestros{" "}
          <a href="/terms" style={{ color: "#06D6A0", textDecoration: "none" }}>
            Términos de servicio
          </a>{" "}
          y{" "}
          <a
            href="/privacy"
            style={{ color: "#06D6A0", textDecoration: "none" }}
          >
            Política de privacidad
          </a>
        </p>
      </div>
    </div>
  );
}
