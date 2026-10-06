import { UIAutocomplete, UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { PersonalRelationKindSelector } from "./personal-relation-kind-selector.component";
import { usePersonalRelationComposer } from "./use-personal-relation-composer.hook";
import type { PersonalRelationComposerProps } from "./personal-relation-composer-props.interface";

export function PersonalRelationComposer(props: PersonalRelationComposerProps) {
  const state = usePersonalRelationComposer(props);

  return (
    <UIContentGroup variant="content">
      <PersonalRelationKindSelector onChange={state.setKind} value={state.kind} />
      <UIAutocomplete label="Origem" options={props.options} onChange={state.setSource} value={state.source} />
      <UIAutocomplete label="Destino" options={props.options} onChange={state.setTarget} value={state.target} />
      <UIButton disabled={!state.canCreate} onClick={state.create} variant="outlined">
        Criar relação
      </UIButton>
    </UIContentGroup>
  );
}
