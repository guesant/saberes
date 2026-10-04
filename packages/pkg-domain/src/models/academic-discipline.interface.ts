import type { AcademicGrade } from "./academic-grade.interface";
import type { AcademicModality } from "./domain.enums";

export interface AcademicDiscipline {
  id: string;
  name: string;
  modality: AcademicModality;
  totalClasses: number;
  attendedClasses: number;
  minimumAttendancePercentage: number;
  minimumGrade: number;
  grades: AcademicGrade[];
  updatedAt: string;
}
