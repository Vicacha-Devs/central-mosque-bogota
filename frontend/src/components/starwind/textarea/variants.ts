import { tv } from "tailwind-variants";

export const textarea = tv({
  base: [
    `
      min-h-10 w-full rounded-md border border-input bg-transparent
      text-foreground shadow-xs ring-offset-background
      dark:bg-input/30
    `,
    `
      transition-[color,box-shadow]
      focus-visible:border-outline focus-visible:ring-3
      focus-visible:ring-outline/50
    `,
    `
      file:border-0 file:bg-transparent file:text-sm file:font-medium
      file:text-foreground
    `,
    "disabled:cursor-not-allowed disabled:opacity-50",
    `
      aria-invalid:border-error
      aria-invalid:focus-visible:ring-error/40
    `,
    `
      peer
      placeholder:text-muted-foreground
    `,
  ],
  variants: {
    size: {
      sm: "min-h-9 px-2 py-1 text-sm",
      md: "min-h-10 px-3 py-2 text-base",
      lg: "min-h-12 px-4 py-3 text-lg",
    },
  },
  defaultVariants: { size: "md" },
});
