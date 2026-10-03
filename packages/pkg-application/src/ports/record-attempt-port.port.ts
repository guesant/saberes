import type { Attempt } from "../models/index.ts";

export interface RecordAttemptPort {
  execute(attempt: Attempt): Promise<Attempt>;
}
