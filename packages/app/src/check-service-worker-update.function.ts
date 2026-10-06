import { checkServiceWorkerRegistration } from "./check-service-worker-registration.function";
import { resolveServiceWorkerStartup } from "./resolve-service-worker-startup.function";
import { startServiceWorkerUpdate } from "./start-service-worker-update.function";
import type { ServiceWorkerStartup } from "./service-worker-startup.interface";

export type RegisterServiceWorker = (options: PwaRegisterOptions) => PwaUnregister;

const SERVICE_WORKER_CHECK_TIMEOUT_MS = 6_000;

export function checkServiceWorkerUpdate(registerServiceWorker: RegisterServiceWorker): Promise<void> {
  return new Promise((resolve) => {
    const startup: ServiceWorkerStartup = {
      activationTimeout: null,
      checkTimeout: null,
      finished: false,
      resolve,
      updateServiceWorker: async () => {},
      updateStarted: false,
    };

    Object.assign(startup, { checkTimeout: setTimeout(() => {
      resolveServiceWorkerStartup(startup);
    }, SERVICE_WORKER_CHECK_TIMEOUT_MS) });

    try {
      Object.assign(startup, { updateServiceWorker: registerServiceWorker({
        immediate: true,
        onNeedRefresh: () => {return startServiceWorkerUpdate(startup);},
        onOfflineReady: () => {return resolveServiceWorkerStartup(startup);},
        onRegisterError: () => {return resolveServiceWorkerStartup(startup);},
        onRegisteredSW: (_scriptUrl, registration) => {
          checkServiceWorkerRegistration(registration, startup);
        },
      }) });
    } catch {
      resolveServiceWorkerStartup(startup);
    }
  });
}
