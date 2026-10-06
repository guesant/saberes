import { createSimulationCompletion } from "../create-simulation-completion.function";
import type { CompleteSimulationSessionCommand } from "./complete-simulation-session.command";
import type { CompleteSimulationSessionCommandResult } from "./complete-simulation-session.command-result";
import type { SimulationServiceDependencies } from "../models/simulation-service-dependencies.interface";

export class CompleteSimulationSessionCommandHandler {
  public constructor(private readonly ports: SimulationServiceDependencies) {}

  public async execute(command: CompleteSimulationSessionCommand): Promise<CompleteSimulationSessionCommandResult> {
    const session = await this.ports.getSession.execute(command.sessionId);

    if (!session || session.mode !== "simulation") {
      throw new Error("Simulado não encontrado.");
    }

    if (session.status === "completed") {
      return { session };
    }

    const startedAt = Date.parse(session.startedAt || "");

    const expiresAt = Date.parse(session.expiresAt || "");

    if (!Number.isFinite(startedAt) || !Number.isFinite(expiresAt) || expiresAt <= startedAt) {
      throw new Error("O simulado não possui um prazo válido.");
    }

    const now = this.ports.clock.execute()
      .getTime();

    const completedAt = new Date(Math.min(now, expiresAt))
      .toISOString();

    const keys = session.questionKeys || [];

    if (!keys.length || new Set(keys).size !== keys.length) {
      throw new Error("O simulado não possui questões válidas.");
    }

    const { attempts, results } = await createSimulationCompletion({
      session,
      questionKeys: keys,
      getQuestion: this.ports.getQuestion,
      completedAt,
    });

    const completedSession = await this.ports.completeSimulationSession.execute({
      expectedRevision: session.revision || 0,
      attempts,
      session: {
        ...session,
        status: "completed",
        completedAt,
        durationMs: Math.max(0, Date.parse(completedAt) - startedAt),
        completionReason: now >= expiresAt ? "expired" : "submitted",
        simulationResults: results,
        answeredQuestionKeys: results.filter((result) => { return Boolean(result.answer.trim()); })
          .map((result) => { return result.questionKey; }),
        skippedQuestionKeys: results.filter((result) => { return !result.answer.trim(); })
          .map((result) => { return result.questionKey; }),
        correctAnswers: results.filter((result) => { return result.isCorrect === true; }).length,
      },
    });

    return { session: completedSession };
  }
}
