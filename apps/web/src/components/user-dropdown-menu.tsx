"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@acme/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { UserAvatar } from "./user-avatar";

interface UserDropdownMenuProps {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export function UserDropdownMenu({ user }: UserDropdownMenuProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess() {
            toast.success("You have been signed out successfully.");

            router.push("/auth/signin");
          },
        },
      });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="secondary" size="icon" className="rounded-full" />
        }
        nativeButton={true}
      >
        <UserAvatar className="size-full" user={user} />
        <span className="sr-only">Toggle user dropdown menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 min-w-48" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserAvatar className="size-6" user={user} />
            <span className="truncate">{user.name}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onClick} disabled={isPending}>
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
