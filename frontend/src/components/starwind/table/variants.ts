import { tv } from "tailwind-variants";

export const table = tv({
  base: "w-full caption-bottom text-sm",
});

export const tableBody = tv({
  base: "[&_tr:last-child]:border-0",
});

export const tableCaption = tv({
  base: "mt-4 text-sm text-muted-foreground",
});

export const tableCell = tv({
  base: `
    p-2 align-middle whitespace-nowrap
    has-[[role=checkbox]]:pr-0
    *:[[role=checkbox]]:translate-y-[2px]
  `,
});

export const tableFoot = tv({
  base: `
    border-t bg-muted/50 font-medium
    [&>tr]:last:border-b-0
  `,
});

export const tableHead = tv({
  base: `
    h-10 px-2 text-left align-middle font-medium whitespace-nowrap
    text-muted-foreground
    has-[[role=checkbox]]:pr-0
    *:[[role=checkbox]]:translate-y-[2px]
  `,
});

export const tableHeader = tv({
  base: "[&_tr]:border-b",
});

export const tableRow = tv({
  base: `
    border-b transition-colors
    hover:bg-muted/50
    data-[state=selected]:bg-muted
  `,
});
