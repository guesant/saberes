import type { SaveStudyGoalCommandHandler } from "../commands/save-study-goal.command-handler";
import type { ListStudyGoalsQueryHandler } from "../queries/list-study-goals.query-handler";

export type GoalsServices = {
  list: ListStudyGoalsQueryHandler;
  save: SaveStudyGoalCommandHandler;
};
