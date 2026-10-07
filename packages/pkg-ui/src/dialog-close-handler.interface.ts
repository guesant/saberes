export interface DialogCloseHandler {
  (event: object, reason: "backdropClick" | "escapeKeyDown"): void;
}
