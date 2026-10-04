import { PedagogicalAction } from "@guesant/saberes-application";

export function getPerformanceActionPath(action: PedagogicalAction): string {
  if (action === PedagogicalAction.Review) {
    return "/revisoes";
  }

  if (action === PedagogicalAction.Retry) {
    return "/desempenho";
  }

  return "/catalogo";
}
