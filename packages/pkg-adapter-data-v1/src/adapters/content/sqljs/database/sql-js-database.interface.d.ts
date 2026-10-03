declare module "sql.js" {
  export interface Database {
    exec(sql: string, params?: QueryParameters): SqlResult[];
  }
}
