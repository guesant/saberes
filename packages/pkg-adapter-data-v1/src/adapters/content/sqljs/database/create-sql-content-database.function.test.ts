import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createSqlContentDatabase } from "./create-sql-content-database.function";
import type { Database, SqlJs } from "sql.js";

const { initSqlJs } = vi.hoisted(() => {
  return { initSqlJs: vi.fn() };
});

vi.mock("sql.js", () => {
  return { default: initSqlJs };
});

let SQL: SqlJs;

const contentBytes = new Uint8Array(readFileSync(path.resolve(process.cwd(), ".local/content/content.sqlite")));

beforeAll(async () => {
  const sqlJs = await vi.importActual<typeof import("sql.js")>("sql.js");

  SQL = await sqlJs.default({ locateFile: () => {
    return path.resolve(process.cwd(), "node_modules/sql.js/dist/sql-wasm.wasm");
  } });
});

afterEach(() => {
  vi.restoreAllMocks();

  vi.resetAllMocks();

  vi.useRealTimers();

  vi.unstubAllEnvs();
});

describe("createSqlContentDatabase", () => {
  it("loads the existing real SQLite and supports parameterized reads", async () => {
    initSqlJs.mockResolvedValue(SQL);

    const database = await createSqlContentDatabase(contentBytes, "/data/content.sqlite");

    expect(database.source)
      .toBe("/data/content.sqlite");

    expect(database.get("SELECT ? AS title", ["Conteúdo real"]))
      .toEqual({ title: "Conteúdo real" });

    expect(database.query("SELECT version FROM content_releases").length)
      .toBeGreaterThan(0);

    expect(database.get("SELECT id FROM lessons WHERE id = ?", [-1]))
      .toBeNull();
  });

  it.each([new Uint8Array(), new Uint8Array(100), new TextEncoder()
    .encode("<!doctype html><html>Saberes</html>")])("rejects non-SQLite responses before initializing WASM", async (bytes) => {
    await expect(createSqlContentDatabase(bytes, "/data/content.sqlite")).rejects.toThrow("não é um banco SQLite válido");

    expect(initSqlJs).not.toHaveBeenCalled();
  });

  it("rejects corruption after a valid SQLite header", async () => {
    initSqlJs.mockResolvedValue(SQL);

    const bytes = contentBytes.slice(0, 100);

    await expect(createSqlContentDatabase(bytes, "/data/content.sqlite")).rejects.toThrow("corrompido");
  });

  it.each(["table", "column"])("rejects a missing schema %s and closes the rejected database", async (kind) => {
    const database = new SQL.Database(contentBytes);

    if (kind === "table") {
      database.exec("DROP TABLE lessons");
    } else {
      database.exec("ALTER TABLE lessons RENAME COLUMN title TO incompatible_title");
    }

    const bytes = database.export();

    database.close();

    const prototype: Database = Object.getPrototypeOf(database);

    const close = vi.spyOn(prototype, "close");

    initSqlJs.mockResolvedValue(SQL);

    await expect(createSqlContentDatabase(bytes, "/data/content.sqlite")).rejects.toThrow("estrutura incompatível");

    expect(close)
      .toHaveBeenCalledTimes(1);
  });

  it("localizes WASM failures and uses the configured asset base", async () => {
    vi.stubEnv("BASE_URL", "/saberes/");

    const cause = new Error("WASM unavailable");

    initSqlJs.mockRejectedValue(cause);

    await expect(createSqlContentDatabase(contentBytes, "/data/content.sqlite")).rejects.toMatchObject({
      message: "Não foi possível iniciar o leitor de conteúdo SQLite.",
      cause,
    });

    expect(initSqlJs.mock.calls[0][0].locateFile())
      .toBe("/saberes/sql-wasm.wasm");
  });

  it("terminates stalled WASM initialization without creating a database", async () => {
    vi.useFakeTimers();

    initSqlJs.mockReturnValue(new Promise<never>(() => {}));

    const rejection = expect(createSqlContentDatabase(contentBytes, "/data/content.sqlite")).rejects.toThrow("demorou demais");

    await vi.advanceTimersByTimeAsync(15_000);

    await rejection;

    expect(vi.getTimerCount())
      .toBe(0);
  });
});
