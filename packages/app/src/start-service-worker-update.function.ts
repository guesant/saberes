import { resolveServiceWorkerStartup } from "./resolve-service-worker-startup.function";
import type { ServiceWorkerStartup } from "./service-worker-startup.interface";

const SERVICE_WORKER_ACTIVATION_TIMEOUT_MS = 12_000;

export function startServiceWorkerUpdate(startup: ServiceWorkerStartup): void {
  if (startup.finished) {
    startup.updateServiceWorker(true)
      .catch(() => {});

    return;
  }

  if (startup.updateStarted) {
    return;
  }

  Object.assign(startup, { updateStarted: true });

  if (startup.checkTimeout) {
    clearTimeout(startup.checkTimeout);
  }

  Object.assign(startup, { activationTimeout: setTimeout(() => {
    Object.assign(startup, { updateStarted: false });

    resolveServiceWorkerStartup(startup);
  }, SERVICE_WORKER_ACTIVATION_TIMEOUT_MS) });

  startup.updateServiceWorker(true)
    .catch(() => {
      Object.assign(startup, { updateStarted: false });

      resolveServiceWorkerStartup(startup);
    });
}
