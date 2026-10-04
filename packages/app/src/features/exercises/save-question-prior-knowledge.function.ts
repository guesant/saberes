import { createQuestionPriorKnowledgeRecord } from "./create-question-prior-knowledge-record.function";
import { findStudyRecordByContentKey } from "./find-study-record-by-content-key.function";
import { getQuestionTopicContentKey } from "./get-question-topic-content-key.function";
import type {
  ApplicationServices,
  PriorKnowledgeStatus,
  QuestionReadModel,
} from "@guesant/saberes-application";

export type SaveQuestionPriorKnowledgeInput = {
  data: QuestionReadModel;
  services: ApplicationServices;
  status: PriorKnowledgeStatus;
};

export async function saveQuestionPriorKnowledge(
  input: SaveQuestionPriorKnowledgeInput,
): Promise<void> {
  const timestamp = new Date().toISOString();

  const masteryRecords = await input.services.progress.listTopicMastery.execute();

  await Promise.all(
    input.data.topics
      .map(getQuestionTopicContentKey)
      .filter((contentKey): contentKey is string => contentKey !== null)
      .map((contentKey) =>
        input.services.progress.saveTopicMastery.execute({
          contentKey,
          data: createQuestionPriorKnowledgeRecord({
            existing: findStudyRecordByContentKey(masteryRecords, contentKey),
            status: input.status,
            timestamp,
          }),
        }),
      ),
  );
}
