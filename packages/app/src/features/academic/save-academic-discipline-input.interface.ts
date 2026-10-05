export interface SaveAcademicDisciplineInput {
  id?: string;

  name: string;
  totalClasses: number;
  attendedClasses: number;
  gradeLabel: string;
  gradeValue: number;
  gradeMaximum: number;
  gradeWeight: number;
}
