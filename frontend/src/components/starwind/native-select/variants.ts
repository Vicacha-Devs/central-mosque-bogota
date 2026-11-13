import { tv } from "tailwind-variants";

export const nativeSelectWrapper = tv({
  base: [
    "starwind-native-select-wrapper",
    `
      group/native-select relative w-fit
      has-[select:disabled]:opacity-50
    `,
  ],
});

export const nativeSelect = tv({
  base: [
    "starwind-native-select",
    `
      w-full rounded-md border border-input bg-transparent text-foreground
      shadow-xs ring-offset-background
      dark:bg-input/30
    `,
    `
      appearance-none bg-none select-none
      selection:bg-primary selection:text-primary-foreground
      placeholder:text-muted-foreground
    `,
    `
      transition-[color,box-shadow] outline-none
      focus-visible:border-outline focus-visible:ring-3
      focus-visible:ring-outline/50
    `,
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    `
      aria-invalid:border-error
      aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-error/40
    `,
  ],
  variants: {
    size: {
      sm: "h-9 pr-8 pl-2 text-sm",
      md: "h-11 pr-9 pl-3 text-base",
      lg: "h-12 pr-10 pl-4 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const nativeSelectIcon = tv({
  base: [
    `
    pointer-events-none absolute top-1/2 -translate-y-1/2 text-foreground
    opacity-50
  `,
  ],
  variants: {
    size: {
      sm: "right-2 size-3.5",
      md: "right-3 size-4",
      lg: "right-4 size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const nativeSelectOptGroup = tv({
  base: "starwind-native-select-optgroup",
});

export const nativeSelectOption = tv({
  base: "starwind-native-select-option",
});
