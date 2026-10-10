import { useCourseAssessmentItems } from "./use-course-assessment-items.hook";
import { useCourseProgressRecords } from "./use-course-progress-records.hook";
import type { ApplicationServices, Attempt, StudyRecord } from "@guesant/saberes-application";

export type CourseProgressQueries = {
  attempts: Attempt[] | undefined;
  error: Error | null;
  enrollments: StudyRecord[] | undefined;
  lessonProgress: StudyRecord[] | undefined;
  assessmentItemsById: Record<string, Array<Record<string, unknown>> | undefined>;
};

export function useCourseProgressQueries(
  services: ApplicationServices,
  items: Array<Record<string, unknown>>,
): CourseProgressQueries {
  const records = useCourseProgressRecords(services);

  const assessment = useCourseAssessmentItems(services, items);

  const error = records.enrollmentsQuery.error ||
    records.lessonProgressQuery.error ||
    records.attemptsQuery.error || assessment.error || null;

  return {
    assessmentItemsById: assessment.assessmentItemsById,
    attempts: records.attemptsQuery.data,
    error,
    enrollments: records.enrollmentsQuery.data,
    lessonProgress: records.lessonProgressQuery.data,
  };
}
