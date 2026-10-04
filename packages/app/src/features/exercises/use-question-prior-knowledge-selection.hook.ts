import { PriorKnowledgeStatus } from "@guesant/saberes-application";
import { useState } from "react";
import type { UseQuestionPriorKnowledgeSelectionInput } from "./use-question-prior-knowledge-selection-input.type";
import type { UseQuestionPriorKnowledgeSelectionResult } from "./use-question-prior-knowledge-selection-result.interface";

export function useQuestionPriorKnowledgeSelection(
  input: UseQuestionPriorKnowledgeSelectionInput,
): UseQuestionPriorKnowledgeSelectionResult {
  const [selected, setSelected] = useState<PriorKnowledgeStatus | null>(null);

  const [error, setError] = useState<Error | null>(null);

  const [saving, setSaving] = useState(false);

  const selectStatus = async (status: PriorKnowledgeStatus): Promise<void> => {
    setError(null);

    setSaving(true);

    try {
      await input.onSelect(status);

      setSelected(status);
    } catch {
      setError(new Error(input.errorMessage));
    } finally {
      setSaving(false);
    }
  };

  const savePriorKnowledgeAgain = async (): Promise<void> => {
    await selectStatus(selected ?? PriorKnowledgeStatus.Unknown);
  };

  return { error, retry: savePriorKnowledgeAgain, saving, selectStatus, selected };
}
