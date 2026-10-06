import { useRef, useState } from "react";
import { saveSimulationSessionCache } from "./save-simulation-session-cache.function";
import type { SimulationSessionUpdaterInput } from "./simulation-session-updater-input.interface";
import type { SimulationSessionUpdater } from "./simulation-session-updater.interface";

export function useSimulationSessionUpdater(input: SimulationSessionUpdaterInput): SimulationSessionUpdater {
  const [pending, setPending] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const queue = useRef<Promise<void>>(Promise.resolve());

  const saveError = useRef(false);

  const cacheSession = saveSimulationSessionCache.bind(null, input.client, input.sessionId);

  const update: SimulationSessionUpdater["update"] = (command) => {
    setPending((count) => { return count + 1; });

    const task = queue.current.then(async () => {
      try {
        const result = await input.services.simulation.update.execute(command);

        cacheSession(result.session);

        saveError.current = false;

        setError(null);
      } catch (cause) {
        saveError.current = true;

        setError(cause instanceof Error ? cause.message : "Não foi possível salvar. Tente novamente.");
      } finally {
        setPending((count) => { return count - 1; });
      }
    });

    queue.current = task;

    return task;
  };

  return {
    pending,
    error,
    update,
    cacheSession,
    setError,
    saveError,
    queue,
  };
}
