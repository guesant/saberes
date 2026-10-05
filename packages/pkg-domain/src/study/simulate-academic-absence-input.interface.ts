import type { AcademicDiscipline } from "../models/academic-discipline.interface";

export interface SimulateAcademicAbsenceInput {
  readonly additionalAbsences: number;
  readonly discipline: AcademicDiscipline;
}
