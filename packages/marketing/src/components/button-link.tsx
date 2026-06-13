"use client";

import Link, { LinkProps } from "next/link";

import { Button, ButtonProps } from "@acme/components/ui/button";

interface ButtonLinkProps extends ButtonProps {
  href: string;
  linkProps?: Omit<LinkProps, "href" | "children">;
}

export function ButtonLink({ href, linkProps, ...props }: ButtonLinkProps) {
  return (
    <Button
      render={<Link href={href} {...linkProps} />}
      nativeButton={false}
      {...props}
    />
  );
}
