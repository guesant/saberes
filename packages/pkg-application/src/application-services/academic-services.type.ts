import type { DeleteAcademicDisciplineCommandHandler } from "../commands/delete-academic-discipline.command-handler";
import type { SaveAcademicDisciplineCommandHandler } from "../commands/save-academic-discipline.command-handler";
import type { CalculateAcademicMetricsQueryHandler } from "../queries/calculate-academic-metrics.query-handler";
import type { ListAcademicDisciplinesQueryHandler } from "../queries/list-academic-disciplines.query-handler";

export type AcademicServices = {
  list: ListAcademicDisciplinesQueryHandler;
  save: SaveAcademicDisciplineCommandHandler;
  delete: DeleteAcademicDisciplineCommandHandler;
  calculateMetrics: CalculateAcademicMetricsQueryHandler;
};
