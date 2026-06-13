export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function getPaginationParams(page: number, per_page: number) {
  const fallbackPage = isNaN(page) || page < 1 ? 1 : page;
  const limit = isNaN(per_page) ? 10 : per_page;
  const offset =
    typeof page === "number"
      ? fallbackPage > 0
        ? (fallbackPage - 1) * limit
        : 0
      : 0;

  return { fallbackPage, offset, limit };
}
