import { useState } from "react";
import type { PersonalLensDialogStateOptions } from "./personal-lens-dialog-state-options.interface";
import type { PersonalLensDialogState } from "./personal-lens-dialog-state.interface";
import type { PersonalLensDialogValues } from "./personal-lens-dialog-values.interface";

export function usePersonalLensDialogState(
  options: PersonalLensDialogStateOptions,
): PersonalLensDialogState {
  const [values, setValues] = useState<PersonalLensDialogValues>({ name: options.initialLens?.name ?? "", open: false, view: options.initialLens?.view ?? "tree" });

  const openDialog = (): void => { setValues({ name: options.initialLens?.name ?? "", open: true, view: options.initialLens?.view ?? "tree" }); };

  const save = async (): Promise<void> => {
    const trimmedName = values.name.trim();

    if (!trimmedName) {
      return;
    }

    await options.onSave({ id: options.initialLens?.id, name: trimmedName, view: values.view });

    setValues({ ...values, open: false });
  };

  const deleteLens = async (): Promise<void> => {
    const id = options.initialLens?.id;

    if (!id || !options.onDelete) {
      return;
    }

    await options.onDelete(id);

    setValues({ ...values, open: false });
  };

  return {
    close: () => { setValues({ ...values, open: false }); },
    deleteLens,
    name: values.name,
    onNameChange: (name: string): void => { setValues({ ...values, name }); },
    onViewChange: (view): void => { setValues({ ...values, view }); },
    open: values.open,
    openDialog,
    save,
    view: values.view,
  };
}
