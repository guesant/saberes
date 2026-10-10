export interface SimulationAnswer {
  questionKey: string;
  value: string;
  answeredAt: string;
  hintIdsUsed?: Array<number | string>;
}
