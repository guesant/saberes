import type { ContentReleaseReadModel } from "../models/content-release-read-model.model";

export interface GetContentReleasePort {
  execute(): Promise<ContentReleaseReadModel | null>;
}
