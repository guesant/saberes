import { UICircularProgress, UIStack } from "@guesant/saberes-ui";

export function UIContentLoadingFallback() {
  return (
    <UIStack alignItems="center" justifyContent="center" minHeight={120}>
      <UICircularProgress size={24} />
    </UIStack>
  );
}
