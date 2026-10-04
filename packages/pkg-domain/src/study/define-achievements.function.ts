export type AchievementStats = {
  attempts?: number;
  correct?: number;
  lessons?: number;
  sessions?: number;
  streak?: number;
  courses?: number;
  reviews?: number;
};

export function defineAchievements(stats: AchievementStats = {}) {
  const definitions = [
    [
      "first-question",
      "Primeira questão",
      "Responda sua primeira questão.",
      stats.attempts || 0,
      1,
    ],
    ["first-lesson", "Primeira aula", "Conclua sua primeira aula.", stats.lessons || 0, 1],
    [
      "first-simulator",
      "Primeiro simulado",
      "Conclua seu primeiro simulado.",
      stats.sessions || 0,
      1,
    ],
    ["ten-questions", "Ritmo de prática", "Responda 10 questões.", stats.attempts || 0, 10],
    ["ten-correct", "Base consistente", "Acerte 10 questões.", stats.correct || 0, 10],
    [
      "seven-day-streak",
      "Uma semana firme",
      "Estude por 7 dias consecutivos.",
      stats.streak || 0,
      7,
    ],
    ["thirty-day-streak", "Constância", "Estude por 30 dias consecutivos.", stats.streak || 0, 30],
    ["first-course", "Trilha concluída", "Conclua seu primeiro curso.", stats.courses || 0, 1],
    ["review-ten", "Revisão ativa", "Revise 10 questões erradas.", stats.reviews || 0, 10],
  ] as const;

  return definitions.map(([key, title, description, value, threshold]) => {
    return {
      key,
      title,
      description,
      isUnlocked: value >= threshold,
    };
  });
}
