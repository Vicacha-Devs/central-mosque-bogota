import { tv } from "tailwind-variants";

export const label = tv({
  base: [
    "leading-none font-medium text-foreground",
    `
      peer-disabled:cursor-not-allowed peer-disabled:opacity-70
      has-[+:disabled]:cursor-not-allowed has-[+:disabled]:opacity-70
    `,
  ],
  variants: { size: { sm: "text-sm", md: "text-base", lg: "text-lg" } },
  defaultVariants: { size: "md" },
});
