import type { RecordAttemptCommandHandler } from "../commands/record-attempt.command-handler";
import type { GetQuestionQueryHandler } from "../queries/get-question.query-handler";

export type ExerciseServices = {
  get: GetQuestionQueryHandler;
  recordAttempt: RecordAttemptCommandHandler;
};
