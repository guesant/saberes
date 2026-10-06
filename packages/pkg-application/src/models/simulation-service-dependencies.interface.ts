import type { SimulationPorts } from "./simulation-ports.interface";
import type { ClockPort } from "../ports/clock-port.port";
import type { GetQuestionPort } from "../ports/get-question-port.port";
import type { GetSessionPort } from "../ports/get-session-port.port";

export interface SimulationServiceDependencies extends SimulationPorts {
  clock: ClockPort;
  getQuestion: GetQuestionPort;
  getSession: GetSessionPort;
}
