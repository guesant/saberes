import { runContentLoadWithTimeout } from "./run-content-load-with-timeout.function";

export async function fetchContentDatabase(url: string): Promise<Uint8Array> {
  const controller = new AbortController();

  const download = (async () => {
    const response = await fetch(url, { cache: "no-cache", signal: controller.signal })
      .catch((cause: unknown) => {
        throw new Error("Não foi possível carregar o conteúdo. Verifique sua conexão e tente novamente.", { cause });
      });

    if (!response.ok) {
      throw new Error(`Não foi possível carregar o conteúdo (${response.status}).`);
    }

    const buffer = await response.arrayBuffer()
      .catch((cause: unknown) => {
        throw new Error("Não foi possível ler o arquivo de conteúdo. Tente novamente.", { cause });
      });

    return new Uint8Array(buffer);
  })();

  return runContentLoadWithTimeout(
    download,
    "O conteúdo demorou demais para carregar. Verifique sua conexão e tente novamente.",
    () => {
      controller.abort();
    },
  );
}
