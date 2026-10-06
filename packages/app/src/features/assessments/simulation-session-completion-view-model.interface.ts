export interface SimulationSessionCompletionViewModel {
  finishing: boolean;
  confirmed: boolean;
  finish(): Promise<void>;

  requestFinish(): void;

  cancelFinish(): void;
}
