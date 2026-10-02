declare module "sql.js" {
    type QueryParameters = unknown[] | Record<string, unknown>;

    type SqlResult = {
        columns: string[];
        values: unknown[][];
    };

    interface Database {
        exec(sql: string, params?: QueryParameters): SqlResult[];
    }

    interface SqlJs {
        Database: new (data?: Uint8Array) => Database;
    }

    interface InitSqlJsOptions {
        locateFile?: (file: string) => string;
    }

    const initSqlJs: (options?: InitSqlJsOptions) => Promise<SqlJs>;

    export default initSqlJs;
}
