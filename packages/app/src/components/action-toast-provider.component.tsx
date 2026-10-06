import { createContext, useCallback, useMemo, useRef, useState } from "react";
import { ActionToastViewport } from "./action-toast-viewport.component";
import type { ActionToastContextValue } from "./action-toast-context-value.interface";
import type { ActionToastEntry } from "./action-toast-entry.interface";
import type { ActionToastProviderProps } from "./action-toast-provider-props.interface";
import type { ActionToastSeverity } from "./action-toast-severity.type";
import type { ReactNode } from "react";

export const ActionToastContext = createContext<ActionToastContextValue | null>(null);

export function ActionToastProvider(props: ActionToastProviderProps) {
  const [queue, setQueue] = useState<ActionToastEntry[]>([]);

  const nextId = useRef(0);

  const enqueue = useCallback((message: ReactNode, severity: ActionToastSeverity) => {
    nextId.current += 1;

    setQueue((currentQueue) => {return [...currentQueue, { id: nextId.current, message, severity }];});
  }, []);

  const contextValue = useMemo(() => {return { enqueue };}, [enqueue]);

  const currentToast = queue[0] ?? null;

  const removeVisibleActionToast = () => {
    setQueue((currentQueue) => {return currentQueue.slice(1);});
  };

  return (
    <ActionToastContext.Provider value={contextValue}>
      {props.children}
      <ActionToastViewport onDismiss={removeVisibleActionToast} toast={currentToast} />
    </ActionToastContext.Provider>
  );
}
