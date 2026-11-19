export type SwitchChangeEvent = {
  detail: {
    checked: boolean;
    switchId: string;
  };
} & CustomEvent;
