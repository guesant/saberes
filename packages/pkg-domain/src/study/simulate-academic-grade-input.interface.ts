import type { AcademicDiscipline } from "../models/academic-discipline.interface";
import type { AcademicGrade } from "../models/academic-grade.interface";

export interface SimulateAcademicGradeInput {
  readonly discipline: AcademicDiscipline;
  readonly grade: AcademicGrade;
}
