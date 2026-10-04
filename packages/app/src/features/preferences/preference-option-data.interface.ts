import type { PreferenceKey } from "./preference-key.type";

export interface PreferenceOptionData {
  description: string;
  key: PreferenceKey;
  title: string;
  value: boolean;
}
