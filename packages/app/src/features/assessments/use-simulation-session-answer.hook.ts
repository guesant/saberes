import { useEffect, useRef, useState } from "react";
import { getSimulationDraftAnswer } from "./get-simulation-draft-answer.function";
import type { SimulationSessionAnswerInput } from "./simulation-session-answer-input.interface";
import type { SimulationSessionAnswerViewModel } from "./simulation-session-answer-view-model.interface";

export function useSimulationSessionAnswer(
  input: SimulationSessionAnswerInput,
): SimulationSessionAnswerViewModel {
  const [answer, setAnswer] = useState("");

  const loadedQuestion = useRef("");

  useEffect(() => {
    if (loadedQuestion.current !== input.questionKey) {
      loadedQuestion.current = input.questionKey;

      setAnswer(getSimulationDraftAnswer(input.session, input.questionKey));
    }
  }, [input.questionKey, input.session]);

  const saveSimulationAnswer = async (value: string): Promise<void> => {
    if (input.remainingSeconds === 0 || input.finishing) {
      return;
    }

    setAnswer(value);

    await input.update({ sessionId: input.sessionId, questionKey: input.questionKey, answer: value });
  };

  return { answer, changeAnswer: saveSimulationAnswer };
}
