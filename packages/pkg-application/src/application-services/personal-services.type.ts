import type { ArchiveStudyCaptureCommandHandler } from "../commands/archive-study-capture.command-handler";
import type { ClassifyStudyCaptureCommandHandler } from "../commands/classify-study-capture.command-handler";
import type { CompleteStudyCaptureCommandHandler } from "../commands/complete-study-capture.command-handler";
import type { PostponeStudyCaptureCommandHandler } from "../commands/postpone-study-capture.command-handler";
import type { RestoreStudyCaptureCommandHandler } from "../commands/restore-study-capture.command-handler";
import type { SavePersonalWorkspaceCommandHandler } from "../commands/save-personal-workspace.command-handler";
import type { UndoStudyCaptureCommandHandler } from "../commands/undo-study-capture.command-handler";
import type { GetPersonalWorkspaceQueryHandler } from "../queries/get-personal-workspace.query-handler";

export type PersonalServices = {
  classifyCapture: ClassifyStudyCaptureCommandHandler;
  completeCapture: CompleteStudyCaptureCommandHandler;
  postponeCapture: PostponeStudyCaptureCommandHandler;
  archiveCapture: ArchiveStudyCaptureCommandHandler;
  restoreCapture: RestoreStudyCaptureCommandHandler;
  undoCapture: UndoStudyCaptureCommandHandler;
  get: GetPersonalWorkspaceQueryHandler;
  save: SavePersonalWorkspaceCommandHandler;
};
