export function calculateAcademicFrequency(totalClasses: number, attendedClasses: number): number {
  if (!totalClasses) {
    return 100;
  }

  return Math.round((attendedClasses / totalClasses) * 10000) / 100;
}
