import { useState } from "react";
import { createPersonalRelationEndpoints } from "./create-personal-relation-endpoints.function";
import type { PersonalRelationComposerProps } from "./personal-relation-composer-props.interface";
import type { PersonalRelationComposerState } from "./personal-relation-composer-state.interface";
import type { PersonalRelationKind } from "@guesant/saberes-application";

export function usePersonalRelationComposer(
  props: PersonalRelationComposerProps,
): PersonalRelationComposerState {
  const [kind, setKind] = useState<PersonalRelationKind>("anchor");

  const [sourceId, setSourceId] = useState("");

  const [sourceType, setSourceType] = useState("note");

  const [targetId, setTargetId] = useState("");

  const [targetType, setTargetType] = useState("topic");

  const canCreate = Boolean(
    createPersonalRelationEndpoints({ sourceId, sourceType, targetId, targetType }),
  );

  const create = async (): Promise<void> => {
    const endpoints = createPersonalRelationEndpoints({ sourceId, sourceType, targetId, targetType });

    if (!endpoints) {
      return;
    }

    await props.onCreate(kind, endpoints.source, endpoints.target);

    setSourceId("");

    setTargetId("");
  };

  return {
    canCreate,
    create,
    kind,
    setKind,
    setSourceId,
    setSourceType,
    setTargetId,
    setTargetType,
    sourceId,
    sourceType,
    targetId,
    targetType,
  };
}
