import { CompleteSimulationSessionCommandHandler } from "./commands/complete-simulation-session.command-handler";
import { UpdateSimulationSessionCommandHandler } from "./commands/update-simulation-session.command-handler";
import type { SimulationServices } from "./application-services/simulation-services.interface";
import type { SimulationServiceDependencies } from "./models/simulation-service-dependencies.interface";

export function createSimulationServices(ports: SimulationServiceDependencies): SimulationServices {
  return {
    update: new UpdateSimulationSessionCommandHandler(ports.updateSimulationSession, ports.clock),
    complete: new CompleteSimulationSessionCommandHandler(ports),
  };
}
