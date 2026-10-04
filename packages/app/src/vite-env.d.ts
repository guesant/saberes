interface PwaRegisterOptions {
  immediate?: boolean;
}

type PwaUnregister = () => void;

declare module "virtual:pwa-register" {
  export function registerSW(options?: PwaRegisterOptions): PwaUnregister;
}
