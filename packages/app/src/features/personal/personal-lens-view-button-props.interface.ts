import type { PersonalLens } from "@guesant/saberes-application";

export interface PersonalLensViewButtonProps {
  lens: PersonalLens;
  onSelect(lens: PersonalLens): void;
}
