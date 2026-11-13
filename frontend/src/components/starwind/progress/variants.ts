import { tv } from "tailwind-variants";

export const progress = tv({
  base: [
    "starwind-progress-bar",
    `
    h-2 w-full overflow-hidden rounded-full bg-muted
  `,
  ],
  variants: {
    variant: {
      indeterminate: "relative",
    },
  },
});

export const progressIndicator = tv({
  base: [
    "starwind-progress-indicator",
    "size-full flex-1 transition-transform",
  ],
  variants: {
    variant: {
      indeterminate: "absolute inset-y-0 inset-s-0 w-3/4",
    },
    color: {
      primary: "bg-primary",
      secondary: "bg-secondary",
      default: "bg-foreground",
      info: "bg-info",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
