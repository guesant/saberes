export interface UseLessonBookmarkActionInput {
  action(): Promise<void>;
  isRemoval: boolean;
}
