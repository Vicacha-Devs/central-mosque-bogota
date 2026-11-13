export type ToggleChangeEvent = {
  detail: {
    pressed: boolean;
    toggleId: string;
    syncGroup?: string;
  };
} & CustomEvent;

export type ToggleSyncEvent = {
  detail: {
    pressed: boolean;
    sourceId: string;
  };
} & CustomEvent;
