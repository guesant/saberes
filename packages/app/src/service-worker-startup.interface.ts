export interface ServiceWorkerStartup {
  activationTimeout: ReturnType<typeof setTimeout> | null;
  checkTimeout: ReturnType<typeof setTimeout> | null;
  finished: boolean;
  resolve(): void;
  updateServiceWorker: PwaUnregister;
  updateStarted: boolean;
}
