export function getCourseRoadmapModuleFirstStepNumber(
  modules: Array<Record<string, unknown>>,
  items: Array<Record<string, unknown>>,
  moduleIndex: number,
): number {
  return modules.slice(0, moduleIndex)
    .reduce((total, module) => {
      return total + items.filter((item) => {return item.module_id === module.id;}).length;
    }, 0) + 1;
}
