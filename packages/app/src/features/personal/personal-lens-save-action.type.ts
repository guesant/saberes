import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";

export type PersonalLensSaveAction = (input: SavePersonalLensInput) => Promise<void>;
