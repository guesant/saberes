interface SqlJsInitOptions {
  locateFile?(file: string): string;
}

declare module "sql.js" {
  function initSqlJs(options?: SqlJsInitOptions): Promise<SqlJs>;

  export default initSqlJs;
}
