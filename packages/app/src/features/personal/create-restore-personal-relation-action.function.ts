import type { PersonalRelationActionDependencies } from "./personal-relation-action-dependencies.interface";
import type { PersonalRelationActions } from "./personal-relation-actions.interface";

export function createRestorePersonalRelationAction(
  dependencies: PersonalRelationActionDependencies,
): PersonalRelationActions["restoreRelation"] {
  return async (id): Promise<void> => {
    await dependencies.services.personal.restoreRelation.execute({
      id,
      now: new Date()
        .toISOString(),
    });

    await dependencies.queryClient.invalidateQueries({ queryKey: ["personal-workspace"] });
  };
}
