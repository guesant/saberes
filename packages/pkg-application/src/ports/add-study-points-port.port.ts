export interface AddStudyPointsPort {
  execute(input: { amount: number; reason: string }): Promise<{ points: number; reason: string }>;
}
