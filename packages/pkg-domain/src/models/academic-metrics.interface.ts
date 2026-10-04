export interface AcademicMetrics {
  disciplineId: string;
  attendancePercentage: number;
  attendanceRisk: boolean;
  currentAverage: number;
  requiredFinalGrade: number | null;
  gradeRisk: boolean;
}
