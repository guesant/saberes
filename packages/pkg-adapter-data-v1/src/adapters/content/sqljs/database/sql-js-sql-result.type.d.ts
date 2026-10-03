declare module "sql.js" {
  export type SqlResult = {
    columns: string[];
    values: unknown[][];
  };
}
