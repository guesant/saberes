import type { Attempt } from "../models/index.ts";

export interface SaveAttemptPort {
  execute(attempt: Attempt): Promise<Attempt>;
}
