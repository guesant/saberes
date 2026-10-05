import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { getPersonalRelationsForContext } from "./get-personal-relations-for-context.function";
import { PersonalRelationComposer } from "./personal-relation-composer.component";
import { PersonalRelationContextFilterControls } from "./personal-relation-context-filter-controls.component";
import { PersonalRelationItem } from "./personal-relation-item.component";
import type { PersonalRelationContextFilter } from "./personal-relation-context-filter.type";
import type { PersonalRelationsSectionProps } from "./personal-relations-section-props.interface";

export function PersonalRelationsSection(props: PersonalRelationsSectionProps) {
  const [filter, setFilter] = useState<PersonalRelationContextFilter>("all");

  const relations = getPersonalRelationsForContext(
    props.relations.filter((relation) => { return relation.kind !== "backlink"; }),
    filter,
  );

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Relações locais</UITypography>
      <UITypography color="text.secondary" variant="body2">
        Ligue registros existentes sem copiar o conteúdo de origem.
      </UITypography>
      <PersonalRelationComposer onCreate={props.onCreate} />
      <PersonalRelationContextFilterControls onChange={setFilter} value={filter} />
      {relations.map((relation) => { return (
        <PersonalRelationItem
          key={relation.id}
          onArchive={props.onArchive}
          onRestore={props.onRestore}
          selection={props.selection}
          relation={relation}
          workspace={props.workspace}
        />
      ); })}
    </UIContentGroup>
  );
}
