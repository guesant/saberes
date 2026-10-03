export interface CalloutBlock {
  type: "callout";
  severity?: "info" | "success" | "warning" | "error";
  title?: string;
  content: string;
}
