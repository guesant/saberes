import { useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createArchivePersonalRelationAction } from "./create-archive-personal-relation-action.function";
import { createPersonalRelationAction } from "./create-personal-relation-action.function";
import { createRestorePersonalRelationAction } from "./create-restore-personal-relation-action.function";
import type { PersonalRelationActionDependencies } from "./personal-relation-action-dependencies.interface";
import type { PersonalRelationActions } from "./personal-relation-actions.interface";

export function usePersonalRelationActions(): PersonalRelationActions {
  const dependencies: PersonalRelationActionDependencies = {
    queryClient: useQueryClient(),
    services: useAppServices(),
  };

  return {
    archiveRelation: createArchivePersonalRelationAction(dependencies),
    createRelation: createPersonalRelationAction(dependencies),
    restoreRelation: createRestorePersonalRelationAction(dependencies),
  };
}
