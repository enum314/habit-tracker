import { PropsWithChildren } from "react";

import { cn } from "@acme/utils/cn";

interface PageHeaderProps extends PropsWithChildren {
  className?: string;
}

export function PageHeader({ className, children }: PageHeaderProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

interface PageTitleProps extends PropsWithChildren {
  className?: string;
}

export function PageTitle({ className, children }: PageTitleProps) {
  return (
    <h1
      className={cn("text-lg font-semibold md:text-2xl lg:text-3xl", className)}
    >
      {children}
    </h1>
  );
}

interface PageDescriptionProps extends PropsWithChildren {
  className?: string;
}

export function PageDescription({ className, children }: PageDescriptionProps) {
  return (
    <p className={cn("text-muted-foreground font-mono text-sm", className)}>
      {children}
    </p>
  );
}
