import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalKnowledgeBoardView } from "./personal-knowledge-board-view.component";
import { PersonalKnowledgeTreeView } from "./personal-knowledge-tree-view.component";
import { PersonalKnowledgeViewControls } from "./personal-knowledge-view-controls.component";
import { usePersonalKnowledgeViewState } from "./use-personal-knowledge-view-state.hook";
import type { PersonalKnowledgeViewsSectionProps } from "./personal-knowledge-views-section-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeViewsSection(props: PersonalKnowledgeViewsSectionProps): ReactElement {
  const viewState = usePersonalKnowledgeViewState(props.workspace);

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Visões do conhecimento</UITypography>
      <UITypography color="text.secondary" variant="body2">
        Árvore, board e lentes usam os mesmos registros e relações locais.
      </UITypography>
      <PersonalKnowledgeViewControls
        lenses={props.workspace.lenses ?? []}
        onLensSelect={viewState.selectLens}
        onSaveLens={async (): Promise<void> => {
          await props.onSaveLens({
            name: viewState.view === "tree" ? "Minha árvore" : "Meu board",
            view: viewState.view,
          });
        }}
        onViewChange={viewState.selectView}
        view={viewState.view}
      />
      {viewState.view === "tree" ? (
        <PersonalKnowledgeTreeView projection={viewState.projection} selection={props.selection} />
      ) : (
        <PersonalKnowledgeBoardView projection={viewState.projection} selection={props.selection} />
      )}
    </UIContentGroup>
  );
}
