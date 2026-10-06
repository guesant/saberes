import type { ServiceWorkerStartup } from "./service-worker-startup.interface";

export function resolveServiceWorkerStartup(startup: ServiceWorkerStartup): void {
  if (startup.finished || startup.updateStarted) {
    return;
  }

  Object.assign(startup, { finished: true });

  if (startup.checkTimeout) {
    clearTimeout(startup.checkTimeout);
  }

  if (startup.activationTimeout) {
    clearTimeout(startup.activationTimeout);
  }

  startup.resolve();
}
