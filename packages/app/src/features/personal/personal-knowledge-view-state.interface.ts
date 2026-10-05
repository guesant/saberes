import type {
  PersonalKnowledgeProjection,
  PersonalLens,
  PersonalLensView,
  PersonalWorkspace,
} from "@guesant/saberes-application";

export interface PersonalKnowledgeViewState {
  projection: PersonalKnowledgeProjection;
  selectLens(lens: PersonalLens): void;

  selectView(view: PersonalLensView): void;
  view: PersonalLensView;
  selectedLens?: PersonalLens;
  workspace: PersonalWorkspace;
}
