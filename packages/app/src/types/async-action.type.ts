export type AsyncAction<TArguments extends readonly unknown[], TResult> = (
  ...args: TArguments
) => Promise<TResult>;
