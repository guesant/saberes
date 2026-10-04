import { describe, expect, it } from "vitest";
import { getProgressSnapshotChecksum } from "./get-progress-snapshot-checksum.function";

describe("getProgressSnapshotChecksum", () => {
  it("produz o mesmo checksum para o mesmo snapshot", async () => {
    const stores = { attempts: [{ contentKey: "question:one", isCorrect: true }] };

    await expect(getProgressSnapshotChecksum(stores)).resolves.toBe(
      await getProgressSnapshotChecksum(stores),
    );
  });

  it("produz checksums diferentes para snapshots diferentes", async () => {
    const first = await getProgressSnapshotChecksum({ attempts: [{ contentKey: "question:one" }] });

    const second = await getProgressSnapshotChecksum({
      attempts: [{ contentKey: "question:two" }],
    });

    expect(first).not.toBe(second);
  });
});
