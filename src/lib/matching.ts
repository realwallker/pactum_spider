import type { UserProfile } from "./types";

export interface ScoreBreakdown {
  complementarySkills: number;
  sharedInterests: number;
  location: number;
  recentActivity: number;
  total: number;
}

const MIN_SCORE_THRESHOLD = 35;

export function calculateComplementarySkillsScore(
  userA: UserProfile,
  userB: UserProfile
): number {
  if (!userA.skills || !userB.skills) return 0;

  const userASkills = new Set(userA.skills);
  const userBSkills = new Set(userB.skills);

  // Avoid matching identical skills (seek complementarity, not equality)
  const identicalCount = Array.from(userASkills).filter((s) =>
    userBSkills.has(s)
  ).length;

  // Count complementary skills
  let complementaryScore = 0;
  for (const skill of userASkills) {
    if (!userBSkills.has(skill)) complementaryScore += 1;
  }
  for (const skill of userBSkills) {
    if (!userASkills.has(skill)) complementaryScore += 1;
  }

  // Score: min(complementary_count * 4, 40), but penalize if too many identical
  let score = Math.min(complementaryScore * 4, 40);
  // Penalize if >50% of skills are identical
  if (
    identicalCount >
    (Math.max(userASkills.size, userBSkills.size) * 0.5 ||
      0)
  ) {
    score = Math.max(0, score - 15);
  }

  return Math.min(score, 40);
}

export function calculateSharedInterestsScore(
  userA: UserProfile,
  userB: UserProfile
): number {
  if (!userA.intereses || !userB.intereses) return 0;

  const interesesA = new Set(userA.intereses);
  const interesesB = new Set(userB.intereses);

  const sharedCount = Array.from(interesesA).filter((i) =>
    interesesB.has(i)
  ).length;

  return Math.min(sharedCount * 5, 25);
}

export function calculateLocationScore(
  userA: UserProfile,
  userB: UserProfile
): number {
  if (!userA.ubicacion || !userB.ubicacion) return 0;

  const locA = userA.ubicacion.toLowerCase().trim();
  const locB = userB.ubicacion.toLowerCase().trim();

  if (locA === locB) return 20; // Same city
  if (locA.split(",")[1]?.trim() === locB.split(",")[1]?.trim()) return 10; // Same province
  if (locA.includes("ecuador") || locB.includes("ecuador")) return 5; // Same country
  return 0;
}

export function calculateRecentActivityScore(
  userA: UserProfile,
  userB: UserProfile
): number {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const userBCreatedDate = new Date(userB.created_at);

  if (userBCreatedDate > sevenDaysAgo) return 15;
  if (userBCreatedDate > thirtyDaysAgo) return 8;
  return 0;
}

export function getScoreBreakdown(
  userA: UserProfile,
  userB: UserProfile
): ScoreBreakdown {
  const complementarySkills = calculateComplementarySkillsScore(userA, userB);
  const sharedInterests = calculateSharedInterestsScore(userA, userB);
  const location = calculateLocationScore(userA, userB);
  const recentActivity = calculateRecentActivityScore(userA, userB);

  return {
    complementarySkills,
    sharedInterests,
    location,
    recentActivity,
    total: complementarySkills + sharedInterests + location + recentActivity,
  };
}

export function calculateMatchScore(
  userA: UserProfile,
  userB: UserProfile
): number {
  const breakdown = getScoreBreakdown(userA, userB);
  return breakdown.total;
}

export function meetsMatchThreshold(score: number): boolean {
  return score >= MIN_SCORE_THRESHOLD;
}

export function filterMatchesByThreshold(
  scores: Array<{ userId: string; score: number }>
): Array<{ userId: string; score: number }> {
  return scores.filter((s) => meetsMatchThreshold(s.score));
}

export const MATCHING_CONFIG = {
  MIN_SCORE_THRESHOLD,
  MAX_SKILLS_POINTS: 40,
  MAX_INTERESTS_POINTS: 25,
  MAX_LOCATION_POINTS: 20,
  MAX_ACTIVITY_POINTS: 15,
  CACHE_DURATION_HOURS: 6,
} as const;
