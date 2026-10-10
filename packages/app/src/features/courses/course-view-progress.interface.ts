import type { CourseProgress } from "./course-progress.interface";

export interface CourseViewProgress {
  started: boolean;
  progress: CourseProgress;
}
