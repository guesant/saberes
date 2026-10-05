import { UIButton, UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { PersonalRelationKindSelector } from "./personal-relation-kind-selector.component";
import { usePersonalRelationComposer } from "./use-personal-relation-composer.hook";
import type { PersonalRelationComposerProps } from "./personal-relation-composer-props.interface";

export function PersonalRelationComposer(props: PersonalRelationComposerProps) {
  const state = usePersonalRelationComposer(props);

  return (
    <UIContentGroup variant="content">
      <PersonalRelationKindSelector onChange={state.setKind} value={state.kind} />
      <UITextField
        label="ID da origem"
        onChange={(event) => { return state.setSourceId(event.target.value); }}
        value={state.sourceId}
      />
      <UITextField
        label="Tipo da origem"
        onChange={(event) => { return state.setSourceType(event.target.value); }}
        value={state.sourceType}
      />
      <UITextField
        label="ID do destino"
        onChange={(event) => { return state.setTargetId(event.target.value); }}
        value={state.targetId}
      />
      <UITextField
        label="Tipo do destino"
        onChange={(event) => { return state.setTargetType(event.target.value); }}
        value={state.targetType}
      />
      <UIButton disabled={!state.canCreate} onClick={state.create} variant="outlined">
        Criar relação
      </UIButton>
    </UIContentGroup>
  );
}
