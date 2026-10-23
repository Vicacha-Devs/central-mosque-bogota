export type SelectChangeEvent = {
  detail: {
    value: string;
    selectId: string;
    label: string;
  };
} & CustomEvent;

export type SelectEvent = {
  detail:
    | { value: string; selectId: string; selectName?: string }
    | { value: string; selectId?: string; selectName: string };
} & CustomEvent;
