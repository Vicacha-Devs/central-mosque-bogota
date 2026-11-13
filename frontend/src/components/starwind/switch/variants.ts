import { tv } from "tailwind-variants";

export const switchWrapper = tv({ base: "starwind-switch flex items-center" });

export const switchButton = tv({
  base: [
    `
      inline-flex h-(--height) w-(--width) items-center rounded-full border
      border-input bg-muted
    `,
    `
      group peer ring-offset-background transition outline-none
      focus-visible:ring-3
    `,
    `
      not-disabled:cursor-pointer
      disabled:cursor-not-allowed disabled:opacity-50
    `,
  ],
  variants: {
    variant: {
      primary: `
        focus:ring-primary/50
        focus-visible:border-primary/70
        aria-checked:border-primary
      `,
      secondary: `
          focus:ring-secondary/50
          focus-visible:border-secondary/70
          aria-checked:border-secondary
        `,
      default: `
        focus:ring-outline/50
        focus-visible:border-outline
        aria-checked:border-foreground
      `,
      info: `
        focus:ring-info/50
        focus-visible:border-info/70
        aria-checked:border-info
      `,
      success: `
        focus:ring-success/50
        focus-visible:border-success/70
        aria-checked:border-success
      `,
      warning: `
        focus:ring-warning/50
        focus-visible:border-warning/70
        aria-checked:border-warning
      `,
      error: `
        focus:ring-error/50
        focus-visible:border-error/70
        aria-checked:border-error
      `,
    },
  },
  defaultVariants: { variant: "default" },
});

export const switchToggle = tv({
  base: [
    "inline-block transform rounded-full bg-foreground transition-transform",
    `
      group-aria-checked:translate-x-(--translation)
      group-aria-[checked=false]:translate-x-[calc(var(--padding)-var(--border-offset))]
    `,
  ],
  variants: { size: { sm: "size-4", md: "size-5", lg: "size-6" } },
  defaultVariants: { size: "md" },
});

export const switchLabel = tv({
  base: `
    ml-2 font-medium text-foreground
    peer-disabled:cursor-not-allowed peer-disabled:opacity-70
  `,
  variants: { size: { sm: "text-sm", md: "text-base", lg: "text-lg" } },
  defaultVariants: { size: "md" },
});
