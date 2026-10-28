import { tv } from "tailwind-variants";

export const accordion = tv({ base: "starwind-accordion" });

export const accordionContent = tv({
  base: [
    "starwind-accordion-content",
    "transform-gpu overflow-hidden",
    "data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up",
    "data-[state=open]:animate-accordion-down",
  ],
});

export const accordionItem = tv({
  base: `
    starwind-accordion-item border-b
    last:border-b-0
  `,
});

export const accordionTrigger = tv({
  base: [
    "starwind-accordion-trigger",
    "flex w-full items-center justify-between gap-4 rounded-md py-4",
    `
      text-left font-medium transition-all
      hover:text-muted-foreground
    `,
    "[&[data-state=open]>svg]:rotate-180",
    `
      outline-none
      focus-visible:border-outline focus-visible:ring-3
      focus-visible:ring-outline/50
    `,
  ],
});
