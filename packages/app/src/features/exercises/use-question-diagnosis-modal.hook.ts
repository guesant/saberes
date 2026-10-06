import { useState } from "react";
import { getVisibleDiagnosisOptions } from "./get-visible-diagnosis-options.function";
import type { QuestionDiagnosisModalState } from "./question-diagnosis-modal-state.interface";
import type { QuestionDiagnosisPanelProps } from "./question-diagnosis-panel-props.interface";
import type { DiagnosisCode } from "@guesant/saberes-application";

export function useQuestionDiagnosisModal(props: QuestionDiagnosisPanelProps): QuestionDiagnosisModalState {
  const [open, setOpen] = useState(false);

  const [selectedCode, setSelectedCode] = useState<DiagnosisCode | null>(null);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(false);

  const [saved, setSaved] = useState(false);

  const saveDiagnosis = async (): Promise<void> => {
    if (!selectedCode) {
      return;
    }

    setSaving(true);

    setError(false);

    try {
      await props.onDiagnose(selectedCode);

      setSaved(true);

      setOpen(false);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return {
    error, open, saved, saving, selectedCode,
    options: getVisibleDiagnosisOptions(props.result),
    closeDialog: () => { setOpen(false); },
    openDialog: () => { setOpen(true); },
    saveDiagnosis,
    selectCode: setSelectedCode,
  };
}
