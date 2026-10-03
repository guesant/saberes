import type { Attempt } from "../models/index";

export interface ListAttemptsPort {
  execute(): Promise<Attempt[]>;
}
