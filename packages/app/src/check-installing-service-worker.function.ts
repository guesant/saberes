import { resolveServiceWorkerStartup } from "./resolve-service-worker-startup.function";
import { startServiceWorkerUpdate } from "./start-service-worker-update.function";
import type { ServiceWorkerStartup } from "./service-worker-startup.interface";

export function checkInstallingServiceWorker(
  registration: ServiceWorkerRegistration,
  startup: ServiceWorkerStartup,
  hasActiveWorker: boolean,
): boolean {
  const installingWorker = registration.installing;

  if (!installingWorker) {
    return false;
  }

  installingWorker.addEventListener("statechange", () => {
    if (installingWorker.state === "installed" && hasActiveWorker) {
      startServiceWorkerUpdate(startup);
    } else if (installingWorker.state === "installed" || installingWorker.state === "redundant") {
      resolveServiceWorkerStartup(startup);
    }
  });

  return true;
}
