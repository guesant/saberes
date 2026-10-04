export interface FocusSessionActions {
  active: boolean;
  onPause(): Promise<void>;

  onResume(): Promise<void>;

  onStop(): Promise<void>;
  paused: boolean;
}
