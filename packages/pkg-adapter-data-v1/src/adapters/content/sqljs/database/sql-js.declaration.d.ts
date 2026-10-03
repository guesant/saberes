declare module "sql.js" {
  const initSqlJs: (options?: InitSqlJsOptions) => Promise<SqlJs>;

  export default initSqlJs;
}
