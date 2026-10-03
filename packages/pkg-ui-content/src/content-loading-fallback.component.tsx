import { CircularProgress, Stack } from "@guesant/saberes-ui";

export function ContentLoadingFallback() {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight={120}>
      <CircularProgress size={24} />
    </Stack>
  );
}
