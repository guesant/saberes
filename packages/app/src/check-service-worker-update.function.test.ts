import { afterEach, expect, it, vi } from "vitest";
import { checkServiceWorkerUpdate, type RegisterServiceWorker } from "./check-service-worker-update.function";

afterEach(() => {
  vi.useRealTimers();
});

it("starts the cached app when no update is available", async () => {
  const registration: RegisterServiceWorker = (options) => {
    options.onRegisteredSW?.("/sw.js", undefined);

    return async () => {};
  };

  await expect(checkServiceWorkerUpdate(registration)).resolves.toBeUndefined();
});

it("reloads if an update finishes installing after the startup check", async () => {
  let requestUpdate: PwaRegisterOptions["onNeedRefresh"];

  const update: PwaUnregister = vi.fn(async (_reloadPage) => {});

  const registration: RegisterServiceWorker = (options) => {
    requestUpdate = options.onNeedRefresh;

    options.onRegisteredSW?.("/sw.js", undefined);

    return update;
  };

  await checkServiceWorkerUpdate(registration);

  requestUpdate?.();

  expect(update)
    .toHaveBeenCalledWith(true);
});

it("activates a waiting update and reloads the page", async () => {
  vi.useFakeTimers();

  const update: PwaUnregister = vi.fn(async (_reloadPage) => {});

  const registration: RegisterServiceWorker = (options) => {
    queueMicrotask(() => {return options.onNeedRefresh?.();});

    return update;
  };

  const startup = checkServiceWorkerUpdate(registration);

  await Promise.resolve();

  expect(update)
    .toHaveBeenCalledWith(true);

  await vi.advanceTimersByTimeAsync(12_000);

  await expect(startup).resolves.toBeUndefined();
});

it("releases startup when service worker registration reports an error", async () => {
  const registration: RegisterServiceWorker = (options) => {
    options.onRegisterError?.(new Error("offline"));

    return async () => {};
  };

  await expect(checkServiceWorkerUpdate(registration)).resolves.toBeUndefined();
});

it("releases startup if service worker registration never completes", async () => {
  vi.useFakeTimers();

  const startup = checkServiceWorkerUpdate(() => {return async () => {};});

  await vi.advanceTimersByTimeAsync(6_000);

  await expect(startup).resolves.toBeUndefined();
});
