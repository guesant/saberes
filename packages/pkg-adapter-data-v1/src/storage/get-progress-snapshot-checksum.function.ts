export async function getProgressSnapshotChecksum(
  stores: Record<string, Array<Record<string, unknown>>>,
): Promise<string> {
  const bytes = new TextEncoder()
    .encode(JSON.stringify(stores));

  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest), (byte) => {
    return byte.toString(16)
      .padStart(2, "0");
  })
    .join("");
}
