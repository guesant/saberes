import type { Attempt } from "../models/progress.models.ts";

export interface RecordAttemptPort {
  execute(attempt: Attempt): Promise<Attempt>;
}
