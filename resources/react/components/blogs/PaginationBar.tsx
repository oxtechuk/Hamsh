import { ChevronLeft, ChevronRight } from "lucide-react";

function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  const near = new Set(
    [1, total, current - 1, current, current + 1].filter(
      (p) => p >= 1 && p <= total,
    ),
  );
  const sorted = Array.from(near).sort((a, b) => a - b);

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && (sorted[i] as number) - (sorted[i - 1] as number) > 1)
      pages.push("...");
    pages.push(sorted[i]);
  }
  return pages;
}

interface IPaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationBarProps) {
  if (totalPages <= 1) return null;

  const pageSlots = buildPages(currentPage, totalPages);

  const btnBase =
    "flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border-2 border-[#C5232B] text-[#C5232B] text-[16px] font-bold transition select-none";

  return (
    <div dir="ltr" className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={[
          btnBase,
          "disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C5232B] hover:text-white",
        ].join(" ")}
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {pageSlots.map((slot, i) =>
        slot === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-[52px] w-[52px] items-center justify-center text-[18px] font-bold text-[#C5232B]"
          >
            ···
          </span>
        ) : (
          <button
            key={slot}
            type="button"
            onClick={() => onPageChange(slot as number)}
            className={[
              btnBase,
              slot === currentPage
                ? "bg-[#C5232B] text-white"
                : "bg-white hover:bg-[#fff0f0]",
            ].join(" ")}
          >
            {slot}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={[
          btnBase,
          "disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C5232B] hover:text-white",
        ].join(" ")}
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
