export type Plan = "free" | "pro" | "scale";
export type ProjectStage = "idea" | "mvp" | "crecimiento";
export type ProjectStatus = "activo" | "pausado";
export type RequestStatus = "pendiente" | "aprobada" | "rechazada";
export type MatchStatus = "pendiente" | "aceptado" | "rechazado";
export type MessageType = "texto" | "archivo";

export interface UserProfile {
  id: string;
  email: string;
  nombre: string | null;
  foto: string | null;
  ubicacion: string | null;
  bio: string | null;
  skills: string[];
  intereses: string[];
  plan: Plan;
  created_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  nombre: string;
  descripcion: string | null;
  sector: string | null;
  etapa: ProjectStage;
  estado: ProjectStatus;
  created_at: string;
  vacancies?: Vacancy[];
  owner?: UserProfile;
}

export interface Vacancy {
  id: string;
  project_id: string;
  titulo: string;
  descripcion: string | null;
  skills_requeridas: string[];
  estado: "abierta" | "cerrada";
}

export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  score: number;
  estado: MatchStatus;
  created_at: string;
  other_user?: UserProfile;
}
