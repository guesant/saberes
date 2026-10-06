declare module "sql.js" {
  export interface Database {
    exec(sql: string, params?: QueryParameters): SqlResult[];

    close(): void;

    export(): Uint8Array;
  }
}
