import type { AcademicDiscipline } from "@guesant/saberes-domain";

export interface ListAcademicDisciplinesPort {
  execute(): Promise<AcademicDiscipline[]>;
}
