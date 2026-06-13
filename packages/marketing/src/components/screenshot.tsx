import * as React from "react";
import Image from "next/image";

import { cn } from "@acme/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangleIcon, ImageIcon } from "lucide-react";

const screenshotVariants = cva(
  "relative rounded-lg border border-gray-200 dark:border-neutral-900",
  {
    variants: {
      variant: {
        placeholder:
          "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
        comparison:
          "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
        workflow:
          "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
        dashboard:
          "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
        timeline:
          "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
        personas:
          "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900",
        security:
          "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
        onboarding:
          "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "placeholder",
      size: "full",
    },
  }
);

export type ScreenshotProps = React.ComponentProps<"div"> &
  VariantProps<typeof screenshotVariants> & {
    description: string;
    imageUrl?: string;
    imageUrlLight?: string;
    imageUrlDark?: string;
    alt?: string;
  };

export function Screenshot({
  description,
  imageUrl,
  imageUrlLight,
  imageUrlDark,
  alt,
  variant,
  size,
  className,
  ...props
}: ScreenshotProps) {
  return (
    <div className={cn("relative my-12", className)} {...props}>
      <div
        className={cn(
          "rounded-lg border border-gray-200 dark:border-neutral-900",
          !imageUrl &&
            !imageUrlLight &&
            !imageUrlDark &&
            screenshotVariants({ variant, size })
        )}
        style={{
          display: "inline-block",
          width: "100%",
          verticalAlign: "top",
          padding: 0,
          margin: 0,
        }}
      >
        {/* Screenshot content */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt || description}
            width={1920}
            height={951}
            className="h-auto w-full rounded-lg object-cover"
            quality={100}
            sizes="100vw"
            priority
            style={{
              margin: 0,
            }}
          />
        ) : imageUrlLight || imageUrlDark ? (
          <>
            {imageUrlLight && (
              <Image
                src={imageUrlLight}
                alt={alt || description}
                width={1920}
                height={951}
                className="h-auto w-full rounded-lg object-cover dark:hidden"
                quality={100}
                sizes="100vw"
                priority
                style={{
                  margin: 0,
                }}
              />
            )}
            {imageUrlDark && (
              <Image
                src={imageUrlDark}
                alt={alt || description}
                width={1920}
                height={951}
                className="hidden h-auto w-full rounded-lg object-cover dark:block"
                quality={100}
                sizes="100vw"
                priority
                style={{
                  margin: 0,
                }}
              />
            )}
          </>
        ) : (
          // Placeholder
          <div className="p-5">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="rounded-full bg-white/50 p-2 dark:bg-gray-800/50">
                <ImageIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Screenshot Placeholder
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Development notice - only show for placeholders */}
      {!imageUrl && !imageUrlLight && !imageUrlDark && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div className="flex items-center space-x-1 rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
            <AlertTriangleIcon className="h-3 w-3" />
            <span>Development</span>
          </div>
        </div>
      )}
    </div>
  );
}
