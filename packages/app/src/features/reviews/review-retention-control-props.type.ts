export type ReviewRetentionControlProps = {
  retention: number;
  onChange: (value: number) => Promise<void>;
};
