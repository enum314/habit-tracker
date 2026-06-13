import { cn } from "@acme/utils/cn";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "h-5 gap-1 rounded-md border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        blue: "text-blue-700 bg-blue-100 border-blue-200 dark:text-cyan-400 dark:bg-cyan-400/5 dark:border-cyan-600",
        yellow:
          "text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-400/5 dark:border-yellow-600",
        green:
          "text-green-700 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-400/5 dark:border-green-600",
        orange:
          "text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-400/5 dark:border-orange-600",
        red: "text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-400/5 dark:border-red-600",
        purple:
          "text-purple-700 bg-purple-100 border-purple-200 dark:text-purple-400 dark:bg-purple-400/5 dark:border-purple-600",
        cyan: "text-cyan-700 bg-cyan-100 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-400/5 dark:border-cyan-600",
        gray: "text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-400/5 dark:border-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
