import type { CreateSimulationSessionViewModelInput } from "./create-simulation-session-view-model-input.interface";
import type { SimulationSessionViewModel } from "./simulation-session-view-model.interface";

export function createSimulationSessionViewModel(
  input: CreateSimulationSessionViewModelInput,
): SimulationSessionViewModel {
  return {
    session: input.query.session,
    question: input.query.question,
    questionKey: input.query.questionKey,
    loading: input.query.loading,
    busy: input.updater.pending > 0 || input.completion.finishing,
    finishing: input.completion.finishing,
    expired: input.remainingSeconds === 0,
    remainingSeconds: input.remainingSeconds,
    answer: input.answer.answer,
    error: input.updater.error,
    contentError: input.query.error,
    confirmed: input.completion.confirmed,
    changeAnswer: input.answer.changeAnswer,
    retryAnswer: () => { return input.updater.update({ sessionId: input.sessionId, questionKey: input.query.questionKey, answer: input.answer.answer }); },
    toggleFlag: () => { return input.updater.update({ sessionId: input.sessionId, questionKey: input.query.questionKey, toggleFlag: true }); },
    navigate: (currentIndex) => { return input.updater.update({ sessionId: input.sessionId, currentIndex }); },
    requestFinish: input.completion.requestFinish,
    cancelFinish: input.completion.cancelFinish,
    finish: input.completion.finish,
    reload: input.query.reload,
  };
}
