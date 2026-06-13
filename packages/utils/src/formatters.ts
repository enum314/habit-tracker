import { format, isSameDay, isSameHour, isSameMinute } from "date-fns";

import type { Currency } from "./currency";

export function formatDate(
  input: string | number | Date,
  compact: boolean = false
): string {
  const date = new Date(input);

  return compact ? format(date, "MM/dd/yyyy") : format(date, "MMMM d, yyyy");
}

export function formatTime(
  time: string | number | Date,
  opts: {
    compact?: boolean;
    withSeconds?: boolean;
  } = {
    compact: false,
    withSeconds: false,
  }
) {
  const { compact, withSeconds } = opts;

  if (compact) {
    return format(new Date(time), withSeconds ? "h:mm:ss a" : "h:mm a");
  }

  return format(new Date(time), withSeconds ? "hh:mm:ss a" : "hh:mm a");
}

export function formatDateTimeRange(
  from: string | number | Date,
  to: string | number | Date,
  opts: {
    compact?: boolean;
    withSeconds?: boolean;
  } = {
    compact: false,
    withSeconds: false,
  }
) {
  const { compact, withSeconds } = opts;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const sameDay = isSameDay(fromDate, toDate);
  const sameHour = isSameHour(fromDate, toDate);
  const sameMinute = isSameMinute(fromDate, toDate);

  if (sameDay) {
    if (sameHour && sameMinute) {
      return `${formatDate(fromDate, compact)} ${formatTime(fromDate, { compact, withSeconds })}`;
    }

    return `${formatDate(fromDate, compact)} ${formatTime(fromDate, { compact, withSeconds })} - ${formatTime(toDate, { compact, withSeconds })}`;
  }

  return `${formatDate(fromDate, compact)} ${formatTime(fromDate, { compact, withSeconds })} - ${formatDate(toDate, compact)} ${formatTime(toDate, { compact, withSeconds })}`;
}

export function formatPrice(
  price: number | string,
  currency: Currency = "USD",
  notation: "compact" | "engineering" | "scientific" | "standard" = "standard"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(Number(price) / 100);
}

export function formatPercentage(percentage: number | string) {
  return (
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(percentage) / 100) + "%"
  );
}

export function formatNumber(
  number: number | string,
  notation: "compact" | "engineering" | "scientific" | "standard" = "standard"
) {
  return new Intl.NumberFormat("en-US", {
    notation,
    maximumFractionDigits: 2,
  }).format(Number(number));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k: number = 1024;
  const dm: number = decimals < 0 ? 0 : decimals;
  const sizes: string[] = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB",
  ];

  const i: number = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
