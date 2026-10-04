export interface ProgressBackupEvent {
  id: string;
  operation: "export" | "import";
  result: "success" | "rejected";
  strategy?: "merge" | "replace";
  scope: string[];
  checksum?: string;
  schemaVersion?: number;
  contentVersion?: string;
  createdAt: string;
  errorMessage?: string;
}
