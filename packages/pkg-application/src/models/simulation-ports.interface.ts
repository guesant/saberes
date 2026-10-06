import type { CompleteSimulationSessionPort } from "../ports/complete-simulation-session-port.port";
import type { UpdateSimulationSessionPort } from "../ports/update-simulation-session-port.port";

export interface SimulationPorts {
  updateSimulationSession: UpdateSimulationSessionPort;
  completeSimulationSession: CompleteSimulationSessionPort;
}
