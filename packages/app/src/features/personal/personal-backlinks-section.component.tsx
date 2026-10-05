import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalRelationItem } from "./personal-relation-item.component";
import type { PersonalBacklinksSectionProps } from "./personal-backlinks-section-props.interface";

export function PersonalBacklinksSection(props: PersonalBacklinksSectionProps) {
  const backlinks = props.relations.filter((relation) => {
    return relation.kind === "backlink";
  });

  if (backlinks.length === 0) {
    return null;
  }

  return (
    <UIContentGroup variant="content">
      <UITypography variant="subtitle1">Mencionado em</UITypography>
      <UITypography color="text.secondary" variant="body2">
        Backlinks apontam quem mencionou cada registro, sem copiar o conteúdo.
      </UITypography>
      {backlinks.map((relation) => { return (
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
