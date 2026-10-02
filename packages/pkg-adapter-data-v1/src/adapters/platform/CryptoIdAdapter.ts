import type { IdPort } from "@guesant/saberes-core";

export class CryptoIdAdapter implements IdPort {
    create() {
        return (
            globalThis.crypto?.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(16).slice(2)}`
        );
    }
}
