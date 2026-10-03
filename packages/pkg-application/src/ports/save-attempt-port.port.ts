import type { Attempt } from "../models/index";

export interface SaveAttemptPort {
  execute(attempt: Attempt): Promise<Attempt>;
}
