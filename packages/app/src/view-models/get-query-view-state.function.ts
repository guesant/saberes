export type QueryViewState = "loading" | "error" | "ready";

export interface QueryViewStateInput {
  isPending: boolean;
  isError: boolean;
}

export function getQueryViewState(input: QueryViewStateInput): QueryViewState {
  if (input.isPending) {
    return "loading";
  }

  if (input.isError) {
    return "error";
  }

  return "ready";
}
