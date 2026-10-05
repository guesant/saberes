import type { PersonalRelationActionDependencies } from "./personal-relation-action-dependencies.interface";
import type { PersonalRelationActions } from "./personal-relation-actions.interface";

export function createPersonalRelationAction(
  dependencies: PersonalRelationActionDependencies,
): PersonalRelationActions["createRelation"] {
  return async (kind, source, target): Promise<void> => {
    await dependencies.services.personal.createRelation.execute({
      id: dependencies.services.platform.ids.execute(),
      kind,
      now: new Date()
        .toISOString(),
      source,
      target,
    });

    await dependencies.queryClient.invalidateQueries({ queryKey: ["personal-workspace"] });
  };
}
