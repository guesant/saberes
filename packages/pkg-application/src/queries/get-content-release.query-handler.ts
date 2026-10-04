import type { ContentReleaseReadModel } from "../models/content-release-read-model.model";
import type { GetContentReleasePort } from "../ports/get-content-release-port.port";

export class GetContentReleaseQueryHandler {
  public constructor(private readonly port: GetContentReleasePort) {}

  public execute(): Promise<ContentReleaseReadModel | null> {
    return this.port.execute();
  }
}
