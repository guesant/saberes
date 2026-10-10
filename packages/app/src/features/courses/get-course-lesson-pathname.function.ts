export function getCourseLessonPathname(item: Record<string, unknown>): string {
  return `/licoes/${encodeURIComponent(String(item.lesson_slug || item.lesson_id))}`;
}
