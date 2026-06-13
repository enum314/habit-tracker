import { HTMLAttributes } from "react";

import { cn } from "@acme/utils/cn";

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

// Children should have size of 10 (className size-10)
EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-muted flex size-20 items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props}>
      {children}
    </h2>
  );
};

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <p
      className={cn(
        "text-muted-foreground mt-2 mb-8 text-center text-sm leading-6 font-normal",
        className
      )}
      {...props}
    />
  );
};
