import { checkInstallingServiceWorker } from "./check-installing-service-worker.function";
import { resolveServiceWorkerStartup } from "./resolve-service-worker-startup.function";
import { startServiceWorkerUpdate } from "./start-service-worker-update.function";
import type { ServiceWorkerStartup } from "./service-worker-startup.interface";

export function checkServiceWorkerRegistration(
  registration: ServiceWorkerRegistration | undefined,
  startup: ServiceWorkerStartup,
): void {
  if (!registration) {
    resolveServiceWorkerStartup(startup);

    return;
  }

  if (registration.waiting) {
    startServiceWorkerUpdate(startup);

    return;
  }

  const hasActiveWorker = Boolean(registration.active);

  let installationObserved = checkInstallingServiceWorker(registration, startup, hasActiveWorker);

  registration.addEventListener("updatefound", () => {
    installationObserved = checkInstallingServiceWorker(registration, startup, hasActiveWorker);
  }, { once: true });

  registration.update()
    .then(() => {
      if (registration.waiting && hasActiveWorker) {
        startServiceWorkerUpdate(startup);
      } else if (!installationObserved) {
        resolveServiceWorkerStartup(startup);
      }
    })
    .catch(() => {
      resolveServiceWorkerStartup(startup);
    });
}
