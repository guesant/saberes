import type { TopicLearningStateKey } from "./topic-learning-state-key.type";

export function getTopicLearningStateKey(state: unknown): TopicLearningStateKey {
  switch (state) {
    case "learning":
      return "map.learningStates.learning";

    case "mastered":
      return "map.learningStates.mastered";

    case "practicing":
      return "map.learningStates.practicing";

    default:
      return "map.learningStates.unseen";
  }
}
