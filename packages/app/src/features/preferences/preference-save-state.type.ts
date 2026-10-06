import type { PreferenceKey } from "./preference-key.type";

export type PreferenceSaveState = Record<PreferenceKey, "idle" | "saving" | "error">;
