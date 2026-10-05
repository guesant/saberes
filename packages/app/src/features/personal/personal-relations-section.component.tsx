import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalRelationComposer } from "./personal-relation-composer.component";
import { PersonalRelationItem } from "./personal-relation-item.component";
import type { PersonalRelationsSectionProps } from "./personal-relations-section-props.interface";

export function PersonalRelationsSection(props: PersonalRelationsSectionProps) {
  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Relações locais</UITypography>
      <UITypography color="text.secondary" variant="body2">
        Ligue registros existentes sem copiar o conteúdo de origem.
      </UITypography>
      <PersonalRelationComposer onCreate={props.onCreate} />
      {props.relations.filter((relation) => { return relation.kind !== "backlink"; })
        .map((relation) => { return (
          <PersonalRelationItem
            key={relation.id}
            onArchive={props.onArchive}
            onRestore={props.onRestore}
            relation={relation}
          />
        ); })}
    </UIContentGroup>
  );
}
