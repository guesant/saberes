import { type PersonalWorkspace } from "@guesant/saberes-application";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createPersonalProgressViewModel } from "./create-personal-progress-view-model.function";
import { createPersonalWorkspaceActions } from "./create-personal-workspace-actions.function";
import { createPersonalWorkspaceSaveAction } from "./create-personal-workspace-save-action.function";
import { usePersonalProgressQueries } from "./use-personal-progress-queries.hook";
import { usePersonalRelationActions } from "./use-personal-relation-actions.hook";
import { usePersonalWorkspaceQuery } from "./use-personal-workspace-query.hook";
import { useSavePersonalWorkspaceMutation } from "./use-save-personal-workspace-mutation.hook";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

const emptyWorkspace: PersonalWorkspace = {
  activities: [],
  notes: [],
  checklists: [],
  captures: [],
  references: [],
};

export function usePersonalWorkspaceViewModel(): PersonalWorkspaceViewModel {
  const services = useAppServices();

  const query = usePersonalWorkspaceQuery();

  const progressQueries = usePersonalProgressQueries(services);

  const mutation = useSavePersonalWorkspaceMutation();

  const relationActions = usePersonalRelationActions();

  const workspace = query.data ?? emptyWorkspace;

  const progress = createPersonalProgressViewModel({
    queries: progressQueries,
    workspace,
  });

  const save = createPersonalWorkspaceSaveAction(mutation);

  const actions = createPersonalWorkspaceActions({
    workspace,
    save,
    generateId: (): string => {
      return services.platform.ids.execute();
    },
  });

  return {
    state: getQueryViewState(query),
    workspace,
    error: query.error ?? null,
    saveError: mutation.error,
    progress,
    ...actions,
    ...relationActions,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}
