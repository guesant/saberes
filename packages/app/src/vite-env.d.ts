interface PwaRegisterOptions {
  immediate?: boolean;
  onNeedRefresh?(): void;

  onOfflineReady?(): void;

  onRegisteredSW?(swScriptUrl: string, registration: ServiceWorkerRegistration | undefined): void;

  onRegisterError?(error: unknown): void;
}

type PwaUnregister = (reloadPage?: boolean) => Promise<void>;

declare module "virtual:pwa-register" {
  export function registerSW(options?: PwaRegisterOptions): PwaUnregister;
}
