"use client";

import "@/styles/globals.css";

// Error boundaries must be Client Components
import { useEffect } from "react";

import { buttonVariants } from "@acme/components/ui/button";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export default function Page({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error occurred:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center px-4 py-32 text-center xl:py-64">
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex justify-center"
            >
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <AlertTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="mb-3 text-3xl font-bold tracking-tight">
                Something went wrong!
              </h1>
              <p className="text-muted-foreground mb-8">
                We&apos;ve encountered an unexpected error.
                {error.digest && (
                  <span className="mt-2 block text-xs">
                    Error ID:{" "}
                    <code className="bg-muted rounded px-1 py-0.5">
                      {error.digest}
                    </code>
                  </span>
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                onClick={() => reset()}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "rounded-full"
                )}
              >
                <RefreshCwIcon className="animate-spin-slow size-4" />
                Try again
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-muted-foreground mt-8 text-sm"
            >
              If the problem persists, please contact our support team.
            </motion.p>
          </div>
        </div>
      </body>
    </html>
  );
}
