import { createPersonalKnowledgeProjection, type PersonalLens, type PersonalLensView, type PersonalWorkspace } from "@guesant/saberes-application";
import { useState } from "react";
import type { PersonalKnowledgeViewState } from "./personal-knowledge-view-state.interface";

export function usePersonalKnowledgeViewState(workspace: PersonalWorkspace): PersonalKnowledgeViewState {
  const [view, setView] = useState<PersonalLensView>("tree");

  const [selectedLens, setSelectedLens] = useState<PersonalLens | undefined>(undefined);

  return {
    projection: createPersonalKnowledgeProjection({ lens: selectedLens, view, workspace }),
    selectLens: (lens: PersonalLens): void => {
      setSelectedLens(lens);

      setView(lens.view);
    },
    selectView: (nextView: PersonalLensView): void => {
      setSelectedLens(undefined);

      setView(nextView);
    },
    selectedLens,
    view,
    workspace,
  };
}
