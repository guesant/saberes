import type { IdPort } from "@guesant/saberes-application";

export class CryptoIdAdapter implements IdPort {
  execute() {
    return (
      globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }
}
