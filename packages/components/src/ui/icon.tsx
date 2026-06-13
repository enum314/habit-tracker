import type { HTMLAttributes } from "react";

import { cn } from "@acme/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TerminalIcon } from "lucide-react";

export function IconContainer({
  icon: Icon,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  icon?: LucideIcon;
}): React.ReactElement {
  return (
    <div
      {...props}
      className={cn(
        "from-fd-secondary rounded-md border bg-linear-to-b p-1 shadow-sm",
        props.className
      )}
    >
      {Icon ? <Icon /> : <TerminalIcon />}
    </div>
  );
}
