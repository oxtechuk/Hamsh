import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import type { ICarsResultsGridProps } from "../interfaces/ICarsResultsGridProps";
import type { IPagBtnProps } from "../interfaces/IPagBtnProps";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

const BTN =
  "flex h-[44px] w-[44px] items-center justify-center rounded-[10px] text-[16px] font-extrabold transition duration-200";

function PagBtn({
  children,
  onClick,
  active = false,
  disabled = false,
}: IPagBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${BTN} ${
        active
          ? "bg-[#E1BE69] border border-[#E1BE69] text-white shadow-sm"
          : "bg-[#F9F8F3] border border-[#172139] text-[#172139] hover:bg-[#F0EEE5]"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function CarsResultsGrid({
  cars,
  currentPage,
  totalPages,
  onPageChange,
}: ICarsResultsGridProps) {
  const pageNums = getPageNumbers(currentPage, totalPages);

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 items-stretch justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} {...car} />
        ))}
      </div>

      {totalPages > 1 && (
        <div dir="ltr" className="mt-14 flex items-center justify-center gap-2.5">
          <PagBtn
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} strokeWidth={2.5} className="text-[#172139]" />
          </PagBtn>

          {pageNums.map((p, i) =>
            p === "..." ? (
              <span
                key={`e-${i}`}
                className="flex h-[44px] min-w-[30px] items-center justify-center text-[18px] font-extrabold text-[#172139]"
              >
                ...
              </span>
            ) : (
              <PagBtn
                key={p}
                onClick={() => onPageChange(p as number)}
                active={p === currentPage}
              >
                {p}
              </PagBtn>
            ),
          )}

          <PagBtn
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} strokeWidth={2.5} className="text-[#172139]" />
          </PagBtn>
        </div>
      )}
    </section>
  );
}
