import type { AcademicDiscipline } from "@guesant/saberes-domain";

export interface SaveAcademicDisciplinePort {
  execute(discipline: AcademicDiscipline): Promise<AcademicDiscipline>;
}
