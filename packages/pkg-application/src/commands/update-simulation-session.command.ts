export interface UpdateSimulationSessionCommand {
  sessionId: string;
  questionKey?: string;
  answer?: string;
  toggleFlag?: boolean;
  currentIndex?: number;
}
