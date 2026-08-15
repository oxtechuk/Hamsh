export type PaginationPage = number | "...";

export function getPageNumbers(
  current: number,
  total: number,
): PaginationPage[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: PaginationPage[] = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let index = left; index <= right; index++) pages.push(index);
  if (right < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}
