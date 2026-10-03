import type { ParseEditorialBlocksInput } from "../models/parse-editorial-blocks-input.interface";
import type { ParseEditorialBlocksResult } from "../models/parse-editorial-blocks-result.type";
import type { ParseEditorialBlocksPort } from "../ports/parse-editorial-blocks-port.port";

export class ParseEditorialBlocksQueryHandler {
  public constructor(private readonly port: ParseEditorialBlocksPort) {}

  public execute(input: ParseEditorialBlocksInput): Promise<ParseEditorialBlocksResult> {
    return this.port.execute(input);
  }
}
