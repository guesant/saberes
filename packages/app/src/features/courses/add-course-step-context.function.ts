export function addCourseStepContext(
  href: string,
  courseSlug: string,
  itemId: unknown,
): string {
  const [pathname, existingQuery] = href.split("?", 2);

  const params = new URLSearchParams(existingQuery);

  params.set("course", courseSlug);

  if (itemId !== undefined && itemId !== null) {
    params.set("step", String(itemId));
  }

  return `${pathname}?${params.toString()}`;
}
