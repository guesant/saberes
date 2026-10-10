export function getCoursePracticePathname(item: Record<string, unknown>): string | null {
  if (item.item_type === "practice") {
    return "/catalogo?modo=praticar";
  }

  return null;
}
