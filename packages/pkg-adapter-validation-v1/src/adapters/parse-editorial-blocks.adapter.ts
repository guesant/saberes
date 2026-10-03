import { safeParse } from "valibot";
import { editorialBlocksSchema } from "./editorial-blocks.schema";
import type {
  EditorialValidationIssue,
  ParseEditorialBlocksInput,
  ParseEditorialBlocksPort,
  ParseEditorialBlocksResult,
} from "@guesant/saberes-application";

export class ValibotParseEditorialBlocksAdapter implements ParseEditorialBlocksPort {
  public async execute(input: ParseEditorialBlocksInput): Promise<ParseEditorialBlocksResult> {
    let value: unknown;

    try {
      value = JSON.parse(input.blocksJson);
    } catch {
      return {
        status: "invalid",
        issues: [{ path: "root", message: "Editorial blocks JSON is invalid." }],
      };
    }

    const result = safeParse(editorialBlocksSchema, value);

    if (result.success) {
      return { status: "valid", blocks: result.output };
    }

    const issues: EditorialValidationIssue[] = result.issues.map((issue) => ({
      path: issue.path?.map((item) => String(item.key)).join(".") || "root",
      message: issue.message,
    }));

    return { status: "invalid", issues };
  }
}
