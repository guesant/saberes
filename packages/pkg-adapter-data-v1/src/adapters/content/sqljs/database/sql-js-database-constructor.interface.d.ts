declare module "sql.js" {
  export interface SqlJsDatabaseConstructor {
    new (data?: Uint8Array): Database;
  }
}
