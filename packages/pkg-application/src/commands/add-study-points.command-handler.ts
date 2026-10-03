import type { AddStudyPointsPort } from "../application.ports.ts";

export interface AddStudyPointsInput {
  amount: number;
  reason: string;
}

export class AddStudyPointsCommandHandler {
  public constructor(private readonly port: AddStudyPointsPort) {}

  public execute(input: AddStudyPointsInput): Promise<{ points: number; reason: string }> {
    return this.port.execute(input);
  }
}
