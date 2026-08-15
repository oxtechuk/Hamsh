import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IPagBtnProps } from "../../interfaces/IPagBtnProps";
import type { IPaginationBarProps } from "../../interfaces/IPaginationBarProps";
import { getPageNumbers } from "../../utils/pagination";

const PAGINATION_BUTTON_CLASSES =
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
      className={`${PAGINATION_BUTTON_CLASSES} ${
        active
          ? "bg-[#E1BE69] border border-[#E1BE69] text-white shadow-sm"
          : "bg-[#F9F8F3] border border-[#172139] text-[#172139] hover:bg-[#F0EEE5]"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationBarProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div
      dir={i18n.dir()}
      className="mt-14 flex items-center justify-center gap-2.5"
    >
      <PagBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <PrevIcon size={20} strokeWidth={2.5} className="text-[#172139]" />
      </PagBtn>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-[44px] min-w-[30px] items-center justify-center text-[18px] font-extrabold text-[#172139]"
          >
            ...
          </span>
        ) : (
          <PagBtn
            key={page}
            onClick={() => onPageChange(page)}
            active={page === currentPage}
          >
            {page}
          </PagBtn>
        ),
      )}

      <PagBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <NextIcon size={20} strokeWidth={2.5} className="text-[#172139]" />
      </PagBtn>
    </div>
  );
}
