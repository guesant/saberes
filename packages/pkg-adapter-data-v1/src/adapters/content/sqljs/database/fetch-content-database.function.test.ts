import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchContentDatabase } from "./fetch-content-database.function";

afterEach(() => {
  vi.unstubAllGlobals();

  vi.useRealTimers();
});

describe("fetchContentDatabase", () => {
  it("downloads once with cache revalidation and an abort signal", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValue(new Response(new Uint8Array([1, 2, 3])));

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchContentDatabase("/data/content.sqlite")).resolves.toEqual(new Uint8Array([1, 2, 3]));

    expect(fetchMock)
      .toHaveBeenCalledExactlyOnceWith("/data/content.sqlite", {
        cache: "no-cache",
        signal: expect.any(AbortSignal),
      });
  });

  it("rejects HTTP errors without reading or retrying the response", async () => {
    const arrayBuffer = vi.fn();

    const fetchMock = vi.fn()
      .mockResolvedValue({ ok: false, status: 503, arrayBuffer });

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchContentDatabase("/data/content.sqlite")).rejects.toThrow("(503)");

    expect(arrayBuffer).not.toHaveBeenCalled();

    expect(fetchMock)
      .toHaveBeenCalledTimes(1);
  });

  it("localizes network and response body errors", async () => {
    const cause = new TypeError("Failed to fetch");

    const fetchMock = vi.fn()
      .mockRejectedValueOnce(cause)
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: vi.fn()
          .mockRejectedValue(cause),
      });

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchContentDatabase("/data/content.sqlite")).rejects.toThrow("Verifique sua conexão");

    await expect(fetchContentDatabase("/data/content.sqlite")).rejects.toThrow("Não foi possível ler o arquivo");
  });

  it.each(["request", "body"])("bounds a stalled %s even when abort is ignored", async (stage) => {
    vi.useFakeTimers();

    const pending = new Promise<never>(() => {});

    const fetchMock = vi.fn()
      .mockResolvedValue({ ok: true, arrayBuffer: () => {
        return pending;
      } });

    if (stage === "request") {
      fetchMock.mockReturnValue(pending);
    }

    vi.stubGlobal("fetch", fetchMock);

    const result = fetchContentDatabase("/data/content.sqlite");

    const rejection = expect(result).rejects.toThrow("demorou demais");

    await vi.advanceTimersByTimeAsync(14_999);

    expect(fetchMock.mock.calls[0][1].signal.aborted)
      .toBe(false);

    await vi.advanceTimersByTimeAsync(1);

    await rejection;

    expect(fetchMock.mock.calls[0][1].signal.aborted)
      .toBe(true);

    expect(fetchMock)
      .toHaveBeenCalledTimes(1);

    expect(vi.getTimerCount())
      .toBe(0);
  });

  it("clears its deadline when the request succeeds or fails", async () => {
    vi.useFakeTimers();

    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response())
      .mockRejectedValueOnce(new Error()));

    await fetchContentDatabase("/data/content.sqlite");

    await expect(fetchContentDatabase("/data/content.sqlite")).rejects.toThrow();

    expect(vi.getTimerCount())
      .toBe(0);
  });
});
