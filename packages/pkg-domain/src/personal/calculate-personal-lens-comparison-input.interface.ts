import type { PersonalLens } from "../models/personal-lens.interface";

export interface CalculatePersonalLensComparisonInput {
  currentLens: PersonalLens;
  candidateLens: PersonalLens;
}
