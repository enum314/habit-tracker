"use client";

import Link from "next/link";

import { buttonVariants } from "@acme/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center xl:py-64">
      <div className="max-w-2xl">
        {/* Animated 404 text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-8xl font-extrabold tracking-tighter text-transparent sm:text-9xl">
            404
          </h1>
        </motion.div>

        {/* Animated subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h2>
          <p className="text-muted-foreground mb-8">
            Oops! The page you&apos;re looking for seems to have wandered off.
          </p>
        </motion.div>

        {/* Animated buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "rounded-full"
            )}
          >
            <HomeIcon className="size-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className={cn(
              buttonVariants({
                className: "dark:text-white",
                variant: "outline",
                size: "lg",
              }),
              "rounded-full"
            )}
          >
            <ArrowLeftIcon className="size-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
