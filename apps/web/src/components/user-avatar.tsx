import type { ComponentProps } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/components/ui/avatar";

import { cn } from "@/lib/utils";

interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  classNames?: {
    image?: string;
    fallback?: string;
    avatar?: string;
  };
  user: {
    name: string;
    image?: string | null;
  };
}

export function UserAvatar({ user, classNames, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props} className={cn(props.className, classNames?.avatar)}>
      {user.image && (
        <AvatarImage
          alt={user.name || "User"}
          src={user.image}
          className={cn(classNames?.image)}
        />
      )}
      <AvatarFallback className={cn(classNames?.fallback)}>
        {user.name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
