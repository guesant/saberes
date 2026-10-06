export interface AssessmentSessionLauncherViewModel {
  questionKeys: string[];
  pending: boolean;
  error: string | null;
  startSession(mode: "practice" | "simulation"): Promise<void>;
}
