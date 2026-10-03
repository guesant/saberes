import type { ParseEditorialBlocksInput } from "../models/parse-editorial-blocks-input.interface.ts";
import type { ParseEditorialBlocksResult } from "../models/parse-editorial-blocks-result.type.ts";
import type { ParseEditorialBlocksPort } from "../ports/parse-editorial-blocks-port.port.ts";

export class ParseEditorialBlocksQueryHandler {
  public constructor(private readonly port: ParseEditorialBlocksPort) {}

  public execute(input: ParseEditorialBlocksInput): Promise<ParseEditorialBlocksResult> {
    return this.port.execute(input);
  }
}
