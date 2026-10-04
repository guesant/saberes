import type {
  ContentSnapshotValidationInput,
  ContentSnapshotValidationResult,
} from "../models/index";
import type { ValidateContentSnapshotPort } from "../ports/index";

export class ValidateContentSnapshotQueryHandler {
  public constructor(private readonly port: ValidateContentSnapshotPort) {}

  public execute(input: ContentSnapshotValidationInput): Promise<ContentSnapshotValidationResult> {
    return this.port.execute(input);
  }
}
