import type { GetContentReleaseQueryHandler } from "../queries/get-content-release.query-handler";
import type { ParseEditorialBlocksQueryHandler } from "../queries/parse-editorial-blocks.query-handler";
import type { ValidateContentSnapshotQueryHandler } from "../queries/validate-content-snapshot.query-handler";

export type EditorialServices = {
  parseBlocks: ParseEditorialBlocksQueryHandler;
  validateSnapshot: ValidateContentSnapshotQueryHandler;
  getRelease: GetContentReleaseQueryHandler;
};
