import { useState } from "react";
import type { PersonalRelationComposerProps } from "./personal-relation-composer-props.interface";
import type { PersonalRelationComposerState } from "./personal-relation-composer-state.interface";
import type { PersonalRelationKind } from "@guesant/saberes-application";

export function usePersonalRelationComposer(
  props: PersonalRelationComposerProps,
): PersonalRelationComposerState {
  const [kind, setKind] = useState<PersonalRelationKind>("anchor");

  const [source, setSource] = useState("");

  const [target, setTarget] = useState("");

  const sourceOption = props.options.find((option) => { return option.value === source; });

  const targetOption = props.options.find((option) => { return option.value === target; });

  const canCreate = Boolean(sourceOption && targetOption && source !== target);

  const create = async (): Promise<void> => {
    if (!sourceOption || !targetOption || !canCreate) {
      return;
    }

    await props.onCreate(kind, sourceOption.endpoint, targetOption.endpoint);

    setSource("");

    setTarget("");
  };

  return {
    canCreate,
    create,
    kind,
    setKind,
    setSource,
    setTarget,
    source,
    target,
  };
}
