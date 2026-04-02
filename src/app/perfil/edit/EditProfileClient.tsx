"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { UserProfile } from "@/lib/types";

const C = {
  bg: "#0f0f1e",
  card: "#1a1a2e",
  border: "#2d2d44",
  cyan: "#06b6d4",
  text: "#ffffff",
  muted: "#9ca3af",
  success: "#10b981",
  danger: "#ef4444",
};

interface Props {
  userProfile: UserProfile;
  userId: string;
}

export default function EditProfileClient({ userProfile, userId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre: userProfile.nombre || "",
    bio: userProfile.bio || "",
    skills: (userProfile.skills || []).join(", "),
    intereses: (userProfile.intereses || []).join(", "),
    ubicacion: userProfile.ubicacion || "",
    foto: userProfile.foto || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
    }

    if (formData.bio.length > 500) {
      newErrors.bio = "La bio no puede exceder 500 caracteres";
    }

    if (formData.ubicacion.length > 100) {
      newErrors.ubicacion = "La ubicación no puede exceder 100 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        nombre: formData.nombre,
        bio: formData.bio || null,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim())
          : [],
        intereses: formData.intereses
          ? formData.intereses.split(",").map((i) => i.trim())
          : [],
        ubicacion: formData.ubicacion || null,
        foto: formData.foto || null,
      };

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar perfil");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/perfil");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Error al guardar cambios",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        padding: "32px",
      }}
    >
      {success && (
        <div
          style={{
            background: C.success + "20",
            border: `1px solid ${C.success}`,
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
            color: C.success,
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ✓ Perfil actualizado correctamente. Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Nombre Completo *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: errors.nombre ? `1px solid ${C.danger}` : `1px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            placeholder="Tu nombre completo"
          />
          {errors.nombre && (
            <p
              style={{
                color: C.danger,
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {errors.nombre}
            </p>
          )}
        </div>

        {/* Bio */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              fontSize: "14px",
              boxSizing: "border-box",
              minHeight: "100px",
              fontFamily: "inherit",
              resize: "vertical",
            }}
            placeholder="Cuéntanos sobre ti..."
          />
          <p
            style={{
              fontSize: "12px",
              color: C.muted,
              marginTop: "4px",
            }}
          >
            {formData.bio.length}/500 caracteres
          </p>
        </div>

        {/* Ubicación */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            placeholder="Ej: Buenos Aires, Argentina"
          />
        </div>

        {/* Skills */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Habilidades
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            placeholder="Ej: React, TypeScript, Node.js (separadas por comas)"
          />
        </div>

        {/* Intereses */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Intereses
          </label>
          <input
            type="text"
            name="intereses"
            value={formData.intereses}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            placeholder="Ej: AI, Fintech, SaaS (separados por comas)"
          />
        </div>

        {/* Foto URL */}
        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            URL de Foto de Perfil
          </label>
          <input
            type="url"
            name="foto"
            value={formData.foto}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.text,
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            placeholder="https://..."
          />
          {formData.foto && (
            <Image
              src={formData.foto}
              alt="Preview"
              width={80}
              height={80}
              style={{
                marginTop: "12px",
                borderRadius: "4px",
                objectFit: "cover",
                border: `1px solid ${C.border}`,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div
            style={{
              background: C.danger + "20",
              border: `1px solid ${C.danger}`,
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "24px",
              color: C.danger,
              fontSize: "14px",
            }}
          >
            {errors.submit}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={loading || success}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              background: loading || success ? C.muted + "50" : C.cyan,
              color: C.bg,
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading || success ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: loading || success ? 0.6 : 1,
            }}
          >
            {loading ? "Guardando..." : success ? "✓ Guardado" : "Guardar Cambios"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "6px",
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.text,
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
