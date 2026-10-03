import { DexieProgressStore } from "./dexie-progress.store";
import type { ListEnrollmentsPort } from "@guesant/saberes-application";

export class ListEnrollmentsAdapter implements ListEnrollmentsPort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(): ReturnType<ListEnrollmentsPort["execute"]> {
    return this.store.listEnrollments();
  }
}
