import type { UpdateSimulationSessionCommand } from "./update-simulation-session.command";
import type { UpdateSimulationSessionCommandResult } from "./update-simulation-session.command-result";
import type { ClockPort } from "../ports/clock-port.port";
import type { UpdateSimulationSessionPort } from "../ports/update-simulation-session-port.port";

export class UpdateSimulationSessionCommandHandler {
  public constructor(
    private readonly port: UpdateSimulationSessionPort,
    private readonly clock: ClockPort,
  ) {}

  public async execute(command: UpdateSimulationSessionCommand): Promise<UpdateSimulationSessionCommandResult> {
    const session = await this.port.execute({ ...command, updatedAt: this.clock.execute()
      .toISOString() });

    return { session };
  }
}
