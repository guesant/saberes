import type { PersonalRelationActionDependencies } from "./personal-relation-action-dependencies.interface";
import type { PersonalRelationActions } from "./personal-relation-actions.interface";

export function createArchivePersonalRelationAction(
  dependencies: PersonalRelationActionDependencies,
): PersonalRelationActions["archiveRelation"] {
  return async (id): Promise<void> => {
    await dependencies.services.personal.archiveRelation.execute({
      id,
      now: new Date()
        .toISOString(),
    });

    await dependencies.queryClient.invalidateQueries({ queryKey: ["personal-workspace"] });
  };
}
