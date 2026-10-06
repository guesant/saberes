import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createSqlContentDatabase, fetchContentDatabase } = vi.hoisted(() => {
  return { createSqlContentDatabase: vi.fn(), fetchContentDatabase: vi.fn() };
});

vi.mock("./create-sql-content-database.function", () => {
  return { createSqlContentDatabase };
});

vi.mock("./fetch-content-database.function", () => {
  return { fetchContentDatabase };
});

beforeEach(() => {
  vi.resetModules();

  vi.resetAllMocks();

  vi.stubEnv("VITE_CONTENT_MODE", "");

  vi.stubEnv("VITE_CONTENT_DB_URL", "");

  vi.stubEnv("BASE_URL", "/saberes/");

  vi.stubEnv("PROD", false);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("loadContentDatabase", () => {
  it("defaults to the real binary and caches only the validated database", async () => {
    const bytes = new Uint8Array([1]);

    const database = { source: "/saberes/data/content.sqlite" };

    fetchContentDatabase.mockResolvedValue(bytes);

    createSqlContentDatabase.mockResolvedValue(database);

    const { loadContentDatabase } = await import("./load-content-database.function");

    await expect(Promise.all([loadContentDatabase(), loadContentDatabase()])).resolves.toEqual([database, database]);

    await expect(loadContentDatabase()).resolves.toBe(database);

    expect(fetchContentDatabase)
      .toHaveBeenCalledExactlyOnceWith(database.source);

    expect(createSqlContentDatabase)
      .toHaveBeenCalledExactlyOnceWith(bytes, database.source);
  });

  it.each(["", "https://content.example/content.sqlite"])("rejects download errors without silently falling back from %s", async (url) => {
    vi.stubEnv("VITE_CONTENT_DB_URL", url);

    const error = new Error("Conteúdo indisponível.");

    fetchContentDatabase.mockRejectedValue(error);

    const { loadContentDatabase } = await import("./load-content-database.function");

    await expect(loadContentDatabase()).rejects.toBe(error);

    expect(fetchContentDatabase)
      .toHaveBeenCalledTimes(1);

    expect(fetchContentDatabase)
      .toHaveBeenCalledWith(url || "/saberes/data/content.sqlite");

    expect(createSqlContentDatabase).not.toHaveBeenCalled();
  });

  it.each(["network", "validation"])("releases failed %s loads for an explicit retry", async (stage) => {
    const error = new Error("Conteúdo inválido.");

    const database = { source: "/saberes/data/content.sqlite" };

    fetchContentDatabase.mockResolvedValue(new Uint8Array([1]));

    createSqlContentDatabase.mockResolvedValue(database);

    if (stage === "network") {
      fetchContentDatabase.mockRejectedValueOnce(error);
    } else {
      createSqlContentDatabase.mockRejectedValueOnce(error);
    }

    const { loadContentDatabase } = await import("./load-content-database.function");

    const attempts = await Promise.allSettled([loadContentDatabase(), loadContentDatabase()]);

    expect(attempts)
      .toEqual([
        { status: "rejected", reason: error },
        { status: "rejected", reason: error },
      ]);

    expect(fetchContentDatabase)
      .toHaveBeenCalledTimes(1);

    await expect(loadContentDatabase()).resolves.toBe(database);

    expect(fetchContentDatabase)
      .toHaveBeenCalledTimes(2);
  });

  it("uses fixtures only with explicit synthetic mode in development", async () => {
    vi.stubEnv("VITE_CONTENT_MODE", "synthetic");

    const { loadContentDatabase } = await import("./load-content-database.function");

    const database = await loadContentDatabase();

    expect(database.source)
      .toBe("synthetic-fixture");

    await expect(loadContentDatabase()).resolves.toBe(database);

    expect(fetchContentDatabase).not.toHaveBeenCalled();

    expect(createSqlContentDatabase).not.toHaveBeenCalled();
  });

  it("rejects synthetic mode in production even when explicitly configured", async () => {
    vi.stubEnv("VITE_CONTENT_MODE", "synthetic");

    vi.stubEnv("PROD", true);

    const { loadContentDatabase } = await import("./load-content-database.function");

    await expect(loadContentDatabase()).rejects.toThrow("apenas em desenvolvimento e testes");

    expect(fetchContentDatabase).not.toHaveBeenCalled();
  });

  it("keeps real production content when fixture mode is absent", async () => {
    vi.stubEnv("PROD", true);

    fetchContentDatabase.mockRejectedValue(new Error("Conteúdo indisponível."));

    const { loadContentDatabase } = await import("./load-content-database.function");

    await expect(loadContentDatabase()).rejects.toThrow("Conteúdo indisponível.");

    expect(fetchContentDatabase)
      .toHaveBeenCalledExactlyOnceWith("/saberes/data/content.sqlite");
  });
});
