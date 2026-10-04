import type { AcademicGrade } from "@guesant/saberes-application";

export interface CreateAcademicDisciplineInput {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  updatedAt: string;
  grades: AcademicGrade[];
}
