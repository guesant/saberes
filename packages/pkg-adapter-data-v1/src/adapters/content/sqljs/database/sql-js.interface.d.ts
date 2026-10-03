declare module "sql.js" {
  export interface SqlJs {
    Database: new (data?: Uint8Array) => Database;
  }
}
