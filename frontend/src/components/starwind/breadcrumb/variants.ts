import { tv } from "tailwind-variants";

export const breadcrumbEllipsis = tv({
  base: `
    flex size-6 items-center justify-center
    [&>svg]:size-4
  `,
});

export const breadcrumbItem = tv({ base: "inline-flex items-center gap-1.5" });

export const breadcrumbLink = tv({
  base: `
  transition-colors
  hover:text-foreground
`,
});

export const breadcrumbList = tv({
  base: `
    flex flex-wrap items-center gap-1.5 wrap-break-word text-muted-foreground
    sm:gap-2
  `,
});

export const breadcrumbPage = tv({ base: "font-normal text-foreground" });

export const breadcrumbSeparator = tv({ base: "[&>svg]:size-4" });
