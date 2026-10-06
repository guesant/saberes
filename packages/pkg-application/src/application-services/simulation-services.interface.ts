import type { CompleteSimulationSessionCommandHandler } from "../commands/complete-simulation-session.command-handler";
import type { UpdateSimulationSessionCommandHandler } from "../commands/update-simulation-session.command-handler";

export interface SimulationServices {
  update: UpdateSimulationSessionCommandHandler;
  complete: CompleteSimulationSessionCommandHandler;
}
