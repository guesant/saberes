import initSqlJs from "sql.js";

const primaryUrl =
    import.meta.env.VITE_CONTENT_DB_URL ||
    `${import.meta.env.BASE_URL}data/content.sqlite`;
const fallbackUrl = `${import.meta.env.BASE_URL}data/content.sqlite`;

type SqlResult = { columns: string[]; values: unknown[][] };
type ContentRow = Record<string, unknown>;
type ContentDatabase = {
    source: string;
    query(sql: string, params?: unknown[]): ContentRow[];
    get(sql: string, params?: unknown[]): ContentRow | null;
};

let databasePromise: Promise<ContentDatabase> | undefined;

function rows(result: SqlResult[] | undefined): ContentRow[] {
    if (!result?.[0]) return [];
    const { columns, values } = result[0];
    return values.map((value) =>
        Object.fromEntries(
            columns.map((column, index) => [column, value[index]]),
        ),
    );
}

async function fetchDatabase(url: string): Promise<Uint8Array> {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok)
        throw new Error(
            `Não foi possível carregar o conteúdo (${response.status}).`,
        );
    return new Uint8Array(await response.arrayBuffer());
}

export async function loadContentDatabase(): Promise<ContentDatabase> {
    if (!databasePromise) {
        databasePromise = (async () => {
            const SQL = await initSqlJs({
                locateFile: () => `${import.meta.env.BASE_URL}sql-wasm.wasm`,
            });
            let bytes: Uint8Array;
            let source = primaryUrl;
            try {
                bytes = await fetchDatabase(primaryUrl);
            } catch (primaryError) {
                if (primaryUrl === fallbackUrl) throw primaryError;
                bytes = await fetchDatabase(fallbackUrl);
                source = fallbackUrl;
            }
            const db = new SQL.Database(bytes);
            return {
                source,
                query(sql: string, params: unknown[] = []) {
                    return rows(db.exec(sql, params));
                },
                get(sql: string, params: unknown[] = []) {
                    return rows(db.exec(sql, params))[0] ?? null;
                },
            };
        })();
    }
    return databasePromise;
}
