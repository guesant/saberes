import type { PersonalProgressReadModel } from "./personal-progress-read-model.interface";

export interface PersonalProgressViewModel {
  state: "loading" | "error" | "ready";
  data: PersonalProgressReadModel;
  error: Error | null;
  reload(): Promise<void>;
}
