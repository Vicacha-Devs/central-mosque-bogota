import { tv } from "tailwind-variants";

export const dropdown = tv({ base: "starwind-dropdown relative" });

export const dropdownSub = tv({ base: "starwind-dropdown-sub relative" });

export const dropdownTriggerWrapper = tv({ base: "starwind-dropdown-trigger" });

export const dropdownContent = tv({
  base: [
    "starwind-dropdown-content",
    `
      z-50 min-w-36 overflow-x-hidden overflow-y-auto rounded-md border
      bg-popover p-1 text-popover-foreground shadow-md
    `,
    `
      zoom-in-95 fade-in
      data-[state=open]:animate-in
    `,
    `
      zoom-out-95 fade-out
      data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards
    `,
    "absolute will-change-transform",
  ],
  variants: {
    side: {
      bottom: "top-full slide-in-from-top-2 slide-out-to-top-2",
      top: "bottom-full slide-in-from-bottom-2 slide-out-to-bottom-2",
      right: "top-0 left-full slide-in-from-left-2 slide-out-to-left-2",
      left: "top-0 right-full slide-in-from-right-2 slide-out-to-right-2",
    },
    align: {
      start: "",
      center: "",
      end: "",
    },
  },
  compoundVariants: [
    {
      side: ["top", "bottom"],
      align: "start",
      class: "left-0 slide-in-from-left-1 slide-out-to-left-1",
    },
    {
      side: ["top", "bottom"],
      align: "center",
      class: "left-1/2 -translate-x-1/2",
    },
    {
      side: ["top", "bottom"],
      align: "end",
      class: "right-0 slide-in-from-right-1 slide-out-to-right-1",
    },
    {
      side: ["left", "right"],
      align: "start",
      class: "top-0",
    },
    {
      side: ["left", "right"],
      align: "center",
      class: "top-1/2 -translate-y-1/2",
    },
    {
      side: ["left", "right"],
      align: "end",
      class: "bottom-0",
    },
  ],
  defaultVariants: {
    side: "bottom",
    align: "start",
  },
});

export const dropdownItem = tv({
  base: [
    `
      relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5
      transition-colors outline-none select-none
      focus:bg-accent focus:text-accent-foreground
    `,
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    `
      group/dropdown-item
      [&>svg]:size-4 [&>svg]:shrink-0
    `,
  ],
  variants: {
    inset: {
      true: "pl-8",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
    },
  },
  defaultVariants: {
    inset: false,
    disabled: false,
  },
});

export const dropdownLabel = tv({
  base: ["px-2 py-1.5 text-sm font-medium text-muted-foreground"],
  variants: {
    inset: {
      true: "pl-8",
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const dropdownSeparator = tv({
  base: "-mx-1 my-1 h-px bg-border",
});

export const dropdownTrigger = tv({
  base: [
    "starwind-dropdown-trigger",
    "inline-flex items-center justify-center",
    `
      transition-[color,box-shadow] outline-none
      focus-visible:ring-3 focus-visible:ring-outline/50
    `,
    "disabled:pointer-events-none",
  ],
});
