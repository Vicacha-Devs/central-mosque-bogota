import { tv } from "tailwind-variants";

export const select = tv({ base: "starwind-select relative" });

export const selectContent = tv({
  base: [
    "starwind-select-content",
    `
      absolute z-50 min-w-32 rounded-md border bg-popover
      text-popover-foreground shadow-md
    `,
    `
      overflow-hidden will-change-transform zoom-in-95 fade-in
      data-[state=open]:animate-in
    `,
    `
      zoom-out-95 fade-out
      data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards
    `,
  ],
  variants: {
    side: {
      bottom: "top-full slide-in-from-top-2 slide-out-to-top-2",
      top: "bottom-full slide-in-from-bottom-2 slide-out-to-bottom-2",
    },
    align: {
      start: "left-0 slide-in-from-left-1 slide-out-to-left-1",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0 slide-in-from-right-1 slide-out-to-right-1",
    },
    size: {
      sm: `
        text-sm
        **:data-[slot=select-label]:text-xs
      `,
      md: `
        text-base
        **:data-[slot=select-label]:text-sm
      `,
      lg: `
        text-lg
        **:data-[slot=select-label]:text-base
      `,
    },
  },
  defaultVariants: { side: "bottom", align: "start", size: "md" },
});

export const selectContentInner = tv({
  base: "max-h-96 w-full min-w-(--select-trigger-width) overflow-y-auto p-1",
});

export const selectItem = tv({
  base: [
    `
      relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8
      pl-2 outline-none select-none
    `,
    "data-active:bg-accent data-active:text-accent-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    `
      not-aria-selected:[&_svg]:hidden
      aria-selected:[&_svg]:flex
    `,
  ],
});

export const selectItemIcon = tv({
  base: "absolute right-2 flex size-4 items-center justify-center",
});

export const selectLabel = tv({
  base: "py-1.5 pr-8 pl-2 text-muted-foreground",
});

export const selectSearch = tv({
  base: [
    `
      flex w-full border-0 bg-transparent px-0 py-2.5
      placeholder:text-muted-foreground
    `,
    `
      ring-0 outline-none
      disabled:cursor-not-allowed disabled:opacity-50
    `,
  ],
});

export const selectSeparator = tv({ base: "-mx-1 my-1 h-px bg-muted" });

export const selectTrigger = tv({
  base: [
    "starwind-select-trigger",
    `
      flex items-center justify-between gap-2 rounded-md border border-input
      bg-transparent text-foreground shadow-xs ring-offset-background
      dark:bg-input/30
    `,
    `
      transition-[color,box-shadow] outline-none
      focus-visible:border-outline focus-visible:ring-3
      focus-visible:ring-outline/50
    `,
    `
      disabled:cursor-not-allowed disabled:opacity-50
      [&>span]:line-clamp-1
    `,
    `
      aria-invalid:border-error
      aria-invalid:focus:ring-3 aria-invalid:focus:ring-error/40
    `,
  ],
  variants: {
    size: {
      sm: "h-9 px-2 text-sm",
      md: "h-11 px-3 text-base",
      lg: "h-12 px-4 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const selectValue = tv({ base: "pointer-events-none" });
