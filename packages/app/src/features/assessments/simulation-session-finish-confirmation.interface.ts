export interface SimulationSessionFinishConfirmation {
  confirmed: boolean;
  requestFinish(): void;

  cancelFinish(): void;
}
