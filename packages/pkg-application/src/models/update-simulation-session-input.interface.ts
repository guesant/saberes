import type { UpdateSimulationSessionCommand } from "../commands/update-simulation-session.command";

export interface UpdateSimulationSessionInput extends UpdateSimulationSessionCommand {
  updatedAt: string;
}
