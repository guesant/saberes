import type {
  AssessmentReadModel,
  CatalogFilters,
  CatalogReadModel,
  ContentReleaseReadModel,
  ContentKey,
  CourseReadModel,
  LessonReadModel,
  QuestionReadModel,
  StudyPlanReadModel,
  TopicMapReadModel,
  TopicReadModel,
} from "@guesant/saberes-application";

export interface ContentRepositoryContract {
  getAssessment(key: ContentKey | string): Promise<AssessmentReadModel | null>;

  getContentRelease(): Promise<ContentReleaseReadModel | null>;

  getCatalog(filters?: CatalogFilters): Promise<CatalogReadModel>;

  getCourse(slug: string): Promise<CourseReadModel | null>;

  getLesson(key: ContentKey | string): Promise<LessonReadModel | null>;

  getQuestion(key: ContentKey | string): Promise<QuestionReadModel | null>;

  getStudyPlan(slug?: string): Promise<StudyPlanReadModel>;

  getTopic(slug: string): Promise<TopicReadModel | null>;

  getTopicMap(mapKey: string): Promise<TopicMapReadModel | null>;
}
