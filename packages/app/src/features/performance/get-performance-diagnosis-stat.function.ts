import { differenceInCalendarDays, parseISO } from "date-fns";
import type { GetPerformanceDiagnosisStatInput } from "./get-performance-diagnosis-stat-input.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";

export function getPerformanceDiagnosisStat(
  input: GetPerformanceDiagnosisStatInput,
): PerformanceDiagnosisStat {
  const recentAttempts = input.attempts.filter(
    (attempt) =>
      input.now &&
      attempt.answeredAt &&
      differenceInCalendarDays(input.now || new Date(), parseISO(attempt.answeredAt)) < 7,
  ).length;

  const topicIds = new Set(input.attempts.flatMap((attempt) => attempt.topicIds || []));

  const questionIds = new Set(
    input.attempts
      .filter((attempt) => attempt.questionId !== undefined)
      .map((attempt) => attempt.questionId),
  );

  const sessionIds = new Set(
    input.attempts
      .filter((attempt) => attempt.sessionId !== undefined)
      .map((attempt) => attempt.sessionId),
  );

  return {
    action: input.actionForDiagnosis(input.code),
    attempts: input.count,
    code: input.code,
    recentAttempts,
    topicCount: topicIds.size,
    questionCount: questionIds.size,
    sessionCount: sessionIds.size,
  };
}
