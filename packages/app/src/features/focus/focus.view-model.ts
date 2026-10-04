import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createFocusViewModelActions } from "./create-focus-view-model-actions.function";
import { useFocusSessionsQuery } from "./use-focus-sessions-query.hook";

export interface FocusViewModel {
  state: "loading" | "error" | "ready";
  sessions: FocusSession[];
  active: FocusSession | null;
  paused: FocusSession | null;
  error: Error | null;
  start(contentKey?: string): Promise<void>;

  pause(): Promise<void>;

  resume(): Promise<void>;

  stop(): Promise<void>;

  reload(): Promise<void>;
}

export function useFocusViewModel(): FocusViewModel {
  const services = useAppServices();

  const query = useFocusSessionsQuery(services);

  const sessions = query.data || [];

  const active = sessions.find((session) => session.status === FocusSessionStatus.Active) || null;

  const paused = sessions.find((session) => session.status === FocusSessionStatus.Paused) || null;

  const state = getQueryViewState(query);

  const actions = createFocusViewModelActions({
    active,
    createId: () => services.platform.ids.execute(),
    paused,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    save: async (session): Promise<void> => {
      await services.focus.save.execute(session);
    },
  });

  return {
    state,
    sessions,
    active,
    paused,
    error: query.error ?? null,
    ...actions,
  };
}
