import type { Attempt } from "./attempt.type";

export interface AttemptWithId extends Attempt {
  id: string;
}
