export interface CourseRoadmapStepProps {
  item: Record<string, unknown>;
  stepNumber: number;
  current: boolean;
  completed: boolean;
  courseSlug?: string;
}
