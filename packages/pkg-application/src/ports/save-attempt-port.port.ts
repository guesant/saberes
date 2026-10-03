import type { Attempt } from "../models/progress.models.ts";

export interface SaveAttemptPort {
  execute(attempt: Attempt): Promise<Attempt>;
}
