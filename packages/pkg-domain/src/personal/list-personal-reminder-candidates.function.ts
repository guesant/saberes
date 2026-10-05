import type { ListPersonalReminderCandidatesInput } from "./list-personal-reminder-candidates-input.interface";
import type { PersonalReminderCandidate } from "./personal-reminder-candidate.interface";

export function listPersonalReminderCandidates(
  input: ListPersonalReminderCandidatesInput,
): PersonalReminderCandidate[] {
  const now = Date.parse(input.now);

  const captures: PersonalReminderCandidate[] = input.workspace.captures
    .flatMap((capture): PersonalReminderCandidate[] => {
      if (
        capture.archived ||
        capture.completed ||
        !capture.dueDate ||
        Date.parse(capture.dueDate) > now
      ) {
        return [];
      }

      return [{ dueAt: capture.dueDate, id: capture.id, source: "capture", title: capture.title }];
    });

  const activities: PersonalReminderCandidate[] = input.workspace.activities
    .flatMap((activity): PersonalReminderCandidate[] => {
      if (
        activity.status === "completed" ||
        activity.status === "archived" ||
        !activity.dueDate ||
        Date.parse(activity.dueDate) > now
      ) {
        return [];
      }

      return [{ dueAt: activity.dueDate, id: activity.id, source: "activity", title: activity.title }];
    });

  return [...captures, ...activities]
    .sort((left, right) => {return left.dueAt.localeCompare(right.dueAt);});
}
