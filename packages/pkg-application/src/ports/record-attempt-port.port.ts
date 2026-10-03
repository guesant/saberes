import type { Attempt } from "../models/index";

export interface RecordAttemptPort {
  execute(attempt: Attempt): Promise<Attempt>;
}
