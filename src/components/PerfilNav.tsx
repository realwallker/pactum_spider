"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const C = {
  border: "rgba(255,255,255,0.08)",
  text: "#F1F5F9",
  muted: "#94A3B8",
};

export function PerfilNav() {
  const router = useRouter();

  return (
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
        <span
          onClick={() => router.push("/directorio")}
          style={{
            color: C.muted,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            transition: "color 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color = C.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color = C.muted;
          }}
        >
          Directorio
        </span>
        <span
          onClick={() => router.push("/matches")}
          style={{
            color: C.muted,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            transition: "color 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color = C.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color = C.muted;
          }}
        >
          Mis matches
        </span>
        <span
          onClick={() => router.push("/dashboard")}
          style={{
            color: C.muted,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            transition: "color 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color = C.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color = C.muted;
          }}
        >
          Dashboard
        </span>
      </div>
    </nav>
  );
}
