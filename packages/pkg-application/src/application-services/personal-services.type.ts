import type { SavePersonalWorkspaceCommandHandler } from "../commands/save-personal-workspace.command-handler";
import type { GetPersonalWorkspaceQueryHandler } from "../queries/get-personal-workspace.query-handler";

export type PersonalServices = {
  get: GetPersonalWorkspaceQueryHandler;
  save: SavePersonalWorkspaceCommandHandler;
};
