export async function fetchContentDatabase(url: string): Promise<Uint8Array> {
  const response = await fetch(url, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Não foi possível carregar o conteúdo (${response.status}).`);
  }

  return new Uint8Array(await response.arrayBuffer());
}
