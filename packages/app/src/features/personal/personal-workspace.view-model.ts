import { type PersonalWorkspace } from "@guesant/saberes-application";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createPersonalWorkspaceActions } from "./create-personal-workspace-actions.function";
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

  const mutation = useSavePersonalWorkspaceMutation();

  const relationActions = usePersonalRelationActions();

  const workspace = query.data ?? emptyWorkspace;

  const save = async (next: PersonalWorkspace): Promise<void> => {
    return mutation.mutateAsync(next)
      .then(() => {
        return undefined;
      });
  };

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
    ...actions,
    ...relationActions,
    reload: async (): Promise<void> => {
      return query.refetch()
        .then(() => {
          return undefined;
        });
    },
  };
}
