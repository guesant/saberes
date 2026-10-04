import type { SaveFocusSessionCommandHandler } from "../commands/save-focus-session.command-handler";
import type { ListFocusSessionsQueryHandler } from "../queries/list-focus-sessions.query-handler";

export type FocusServices = {
  list: ListFocusSessionsQueryHandler;
  save: SaveFocusSessionCommandHandler;
};
