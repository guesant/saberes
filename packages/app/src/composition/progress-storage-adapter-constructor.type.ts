import type { ProgressStorageContract } from "@guesant/saberes-adapter-data-v1";

export type ProgressStorageAdapterConstructor<TAdapter> = new (
  store: ProgressStorageContract,
) => TAdapter;
