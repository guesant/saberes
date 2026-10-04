import type { ProgressImportStrategy } from "./progress-import-strategy.type";

export interface ImportProgressInput {
  snapshot: string;
  strategy: ProgressImportStrategy;
}
