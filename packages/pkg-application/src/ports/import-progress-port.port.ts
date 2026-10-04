import type { ImportProgressInput } from "../models/import-progress-input.interface";

export interface ImportProgressPort {
  execute(input: ImportProgressInput): Promise<void>;
}
