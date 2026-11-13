import { tv } from "tailwind-variants";

export const avatar = tv({
  base: `
    relative overflow-hidden rounded-full border-2 bg-muted text-foreground
  `,
  variants: {
    variant: {
      default: "border-border",
      primary: "border-primary",
      secondary: "border-secondary",
      info: "border-info",
      success: "border-success",
      warning: "border-warning",
      error: "border-error",
    },
    size: {
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-12 text-base",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export const avatarFallback = tv({
  base: `
    absolute inset-0.5 flex items-center justify-center rounded-full font-medium
  `,
});

export const avatarImage = tv({ base: "relative z-1 size-full object-cover" });
