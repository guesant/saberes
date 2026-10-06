import { useContext } from "react";
import { ActionToastContext } from "./action-toast-provider.component";

export function useActionToast() {
  const context = useContext(ActionToastContext);

  if (!context) {
    throw new Error("ActionToastProvider is required to show action feedback.");
  }

  return context;
}
