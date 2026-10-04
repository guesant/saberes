import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";

export interface AcademicDisciplineFormSave {
  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
}
