import type { MyStudyMetrics } from "./my-study-metrics.interface";
import type { MyStudyReadModel } from "./my-study-read-model.interface";

export function getMyStudyMetrics(data: MyStudyReadModel): MyStudyMetrics {
  return {
    answered: data.attempts.length,
    correct: data.attempts.filter((attempt) => attempt.isCorrect === true).length,
    nextCourse: data.catalog.courses[0] || null,
    reviews: data.reviews.length,
    streak: Number(data.streak?.current || 0),
    achievements: data.achievements.length,
    masteredTopics: data.topicMastery.filter((record) => record.learningState === "mastered")
      .length,
  };
}
