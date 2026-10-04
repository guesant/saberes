import { createCompletedFocusSession } from "./create-completed-focus-session.function";
import { createFocusSession } from "./create-focus-session.function";
import { pauseFocusSession } from "./pause-focus-session.function";
import { resumeFocusSession } from "./resume-focus-session.function";
import type { FocusViewModelActionDependencies } from "./focus-view-model-action-dependencies.interface";
import type { FocusViewModel } from "./focus.view-model";

export function createFocusViewModelActions(
  input: FocusViewModelActionDependencies,
): Pick<FocusViewModel, "pause" | "resume" | "start" | "stop" | "reload"> {
  const start = async (contentKey?: string): Promise<void> => {
    const session = createFocusSession(input.createId(), new Date().toISOString(), contentKey);

    await input.save(session);
  };

  const stop = async (): Promise<void> => {
    const session = input.active || input.paused;

    if (session) {
      await input.save(createCompletedFocusSession(session, new Date()));
    }
  };

  const pause = async (): Promise<void> => {
    if (input.active) {
      await input.save(pauseFocusSession(input.active, new Date()));
    }
  };

  const resume = async (): Promise<void> => {
    if (input.paused) {
      await input.save(resumeFocusSession(input.paused, new Date()));
    }
  };

  return { pause, reload: input.reload, resume, start, stop };
}
