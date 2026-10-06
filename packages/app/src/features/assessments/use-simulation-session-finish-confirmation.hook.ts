import { useState } from "react";
import type { SimulationSessionFinishConfirmation } from "./simulation-session-finish-confirmation.interface";

export function useSimulationSessionFinishConfirmation(): SimulationSessionFinishConfirmation {
  const [confirmed, setConfirmed] = useState(false);

  return {
    confirmed,
    requestFinish: () => { return setConfirmed(true); },
    cancelFinish: () => { return setConfirmed(false); },
  };
}
