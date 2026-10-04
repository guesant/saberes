export interface DeleteAcademicDisciplinePort {
  execute(id: string): Promise<void>;
}
