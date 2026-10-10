export function getCourseLessonStepType(item: Record<string, unknown>): string {
  const slug = String(item.lesson_slug || "");

  if (slug.endsWith("-exemplo")) {
    return "Exemplo resolvido";
  }

  if (slug.endsWith("-revisao")) {
    return "Revisão";
  }

  return "Teoria";
}
