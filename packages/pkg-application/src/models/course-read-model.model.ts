export interface CourseReadModel {
  course: Record<string, unknown>;
  modules: Array<Record<string, unknown>>;
  items: Array<Record<string, unknown>>;
}
