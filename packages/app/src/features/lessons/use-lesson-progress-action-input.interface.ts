export interface UseLessonProgressActionInput {
  action(completed: boolean): Promise<void>;
}
