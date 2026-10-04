import { UICircularProgress, UIContentLoadingLayout } from "@guesant/saberes-ui";

export function UIContentLoadingFallback() {
  return (
    <UIContentLoadingLayout>
      <UICircularProgress size={24} />
    </UIContentLoadingLayout>
  );
}
