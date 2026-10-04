export interface ReviewRetentionViewModel {
  retention: number;
  setRetention(value: number): Promise<void>;
}
