import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline } from "@guesant/saberes-application";

export interface AcademicDisciplineFormSave {
  initialDiscipline?: AcademicDiscipline;

  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
}
