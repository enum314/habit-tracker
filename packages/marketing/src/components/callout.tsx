import { cn } from "@acme/utils/cn";

interface CalloutProps {
  icon?: string;
  children?: React.ReactNode;
  type?: "default" | "warning" | "danger";
}

export function Callout({
  children,
  icon,
  type = "default",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn("my-6 flex items-start rounded-md border border-l-4 p-4", {
        "border-red-400 bg-red-100 dark:border-red-900 dark:bg-red-950":
          type === "danger",
        "border-yellow-400 bg-yellow-100 dark:border-yellow-900 dark:bg-yellow-950":
          type === "warning",
      })}
      {...props}
    >
      {icon ? <span className="mr-4 text-2xl">{icon}</span> : null}
      <div>{children}</div>
    </div>
  );
}
