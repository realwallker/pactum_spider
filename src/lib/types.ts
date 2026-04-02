export type Plan = "free" | "pro" | "scale";
export type ProjectStage = "idea" | "mvp" | "crecimiento";
export type ProjectStatus = "activo" | "pausado";
export type RequestStatus = "pendiente" | "aprobada" | "rechazada";
export type MatchStatus = "pendiente" | "aceptado" | "rechazado";
export type MessageType = "texto" | "archivo";
export type Availability = "disponible" | "parcial" | "no_disponible";

export interface UserProfile {
  id: string;
  email: string;
  nombre: string | null;
  foto: string | null;
  ubicacion: string | null;
  bio: string | null;
  linkedin_url: string | null;
  availability: Availability;
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
  location: string | null;
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

export interface JoinRequest {
  id: string;
  user_id: string;
  project_id: string;
  vacancy_id: string | null;
  mensaje: string;
  estado: RequestStatus;
  created_at: string;
  user?: UserProfile;
  project?: Project;
  vacancy?: Vacancy;
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

export interface MatchRoom {
  id: string;
  match_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: "active" | "canceled" | "past_due";
  current_period_end: string;
}
