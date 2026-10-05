import type { PersonalLens, PersonalLensView } from "@guesant/saberes-application";

export interface PersonalKnowledgeViewControlsProps {
  lenses: PersonalLens[];
  onLensSelect(lens: PersonalLens): void;

  onSaveLens(): Promise<void>;

  onViewChange(view: PersonalLensView): void;
  view: PersonalLensView;
}
