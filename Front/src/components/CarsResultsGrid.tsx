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
  "flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#C7232B]/40 text-[14px] font-bold transition";

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
          ? "border-[#9B1B22] bg-[#9B1B22] text-white"
          : "bg-white text-[#C7232B] hover:bg-[#C7232B]/5"
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
      <div className="grid grid-cols-1 items-stretch justify-items-center gap-5 sm:grid-cols-2">
        {cars.map((car) => (
          <CarCard key={car.id} {...car} />
        ))}
      </div>

      {totalPages > 1 && (
        <div dir="ltr" className="mt-14 flex items-center justify-center gap-2">
          <PagBtn
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </PagBtn>

          {pageNums.map((p, i) =>
            p === "..." ? (
              <span
                key={`e-${i}`}
                className="flex h-[40px] w-[40px] items-center justify-center text-[14px] font-bold text-[#C7232B]"
              >
                ···
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
            <ChevronRight size={18} strokeWidth={2.2} />
          </PagBtn>
        </div>
      )}
    </section>
  );
}
