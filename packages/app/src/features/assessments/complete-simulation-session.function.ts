import type { CompleteSimulationSessionInput } from "./complete-simulation-session-input.interface";

export async function completeSimulationSession(input: CompleteSimulationSessionInput): Promise<void> {
  await input.updater.queue.current;

  if (input.updater.saveError.current && input.remainingSeconds !== 0) {
    throw new Error("Salve a resposta novamente antes de finalizar.");
  }

  const result = await input.services.simulation.complete.execute({ sessionId: input.sessionId });

  input.updater.cacheSession(result.session);

  await Promise.all([
    input.client.invalidateQueries({ queryKey: ["attempts"] }),
    input.client.invalidateQueries({ queryKey: ["study-sessions"] }),
  ]);

  input.updater.setError(null);
}
