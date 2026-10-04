import { type PersonalWorkspace } from "@guesant/saberes-application";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createPersonalWorkspaceActions } from "./create-personal-workspace-actions.function";
import { usePersonalWorkspaceQuery } from "./use-personal-workspace-query.hook";
import { useSavePersonalWorkspaceMutation } from "./use-save-personal-workspace-mutation.hook";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

const emptyWorkspace: PersonalWorkspace = {
  notes: [],
  checklists: [],
  captures: [],
  references: [],
};

export function usePersonalWorkspaceViewModel(): PersonalWorkspaceViewModel {
  const services = useAppServices();

  const query = usePersonalWorkspaceQuery();

  const mutation = useSavePersonalWorkspaceMutation();

  const workspace = query.data ?? emptyWorkspace;

  const save = async (next: PersonalWorkspace): Promise<void> =>
    mutation.mutateAsync(next).then(() => undefined);

  const actions = createPersonalWorkspaceActions({
    workspace,
    save,
    generateId: (): string => services.platform.ids.execute(),
  });

  return {
    state: getQueryViewState(query),
    workspace,
    error: query.error ?? null,
    saveError: mutation.error,
    ...actions,
    reload: async (): Promise<void> => query.refetch().then(() => undefined),
  };
}
