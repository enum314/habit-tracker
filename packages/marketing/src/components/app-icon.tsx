"use client";

import { forwardRef, SVGProps } from "react";

import { RxLaptop, RxMoon, RxSun } from "react-icons/rx";

const appIcons = {
  sun: RxSun,
  moon: RxMoon,
  system: RxLaptop,
};

export type AppIconType = keyof typeof appIcons;

interface AppIconProps extends SVGProps<SVGSVGElement> {
  icon: AppIconType;
}

export const AppIcon = forwardRef<SVGSVGElement, AppIconProps>(
  ({ icon, ...props }, ref) => {
    const IconComponent = appIcons[icon];

    return <IconComponent {...(props as any)} ref={ref} />;
  }
);

AppIcon.displayName = "AppIcon";
