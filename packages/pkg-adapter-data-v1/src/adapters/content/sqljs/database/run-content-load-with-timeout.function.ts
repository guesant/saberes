import type { ContentLoadTimeoutHandler } from "./content-load-timeout-handler.type";

export async function runContentLoadWithTimeout<T>(
  operation: Promise<T>,
  message: string,
  onTimeout: ContentLoadTimeoutHandler = () => {},
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const deadline = new Promise<never>((_resolve, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(message));

      onTimeout();
    }, 15_000);
  });

  try {
    return await Promise.race([operation, deadline]);
  } finally {
    clearTimeout(timeout);
  }
}
