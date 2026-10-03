import type { Attempt } from "../models/progress.models.ts";

export interface ListAttemptsPort {
  execute(): Promise<Attempt[]>;
}
