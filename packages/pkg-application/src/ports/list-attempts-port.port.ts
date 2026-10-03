import type { Attempt } from "../models/index.ts";

export interface ListAttemptsPort {
  execute(): Promise<Attempt[]>;
}
