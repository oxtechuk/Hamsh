import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import OfferListCard from "./OfferListCard";
import type { IOffersGridSectionProps } from "../../interfaces/IOffersGridSectionProps";
import type { IPagBtnProps } from "../../interfaces/IPagBtnProps";

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

export default function OffersGridSection({
    offers,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}: IOffersGridSectionProps) {
    const { i18n } = useTranslation();

    return (
        <section dir={i18n.dir()} className="w-full py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Grid */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                    {offers.map((offer) => (
                        <OfferListCard key={offer.id} {...offer} />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div
                        dir="ltr"
                        className="mt-14 flex items-center justify-center gap-2"
                    >
                        <PagBtn
                            onClick={() => onPageChange?.(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} strokeWidth={2.2} />
                        </PagBtn>

                        {getPageNumbers(currentPage, totalPages).map((p, i) =>
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
                                    onClick={() => onPageChange?.(p as number)}
                                    active={p === currentPage}
                                >
                                    {p}
                                </PagBtn>
                            ),
                        )}

                        <PagBtn
                            onClick={() => onPageChange?.(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={18} strokeWidth={2.2} />
                        </PagBtn>
                    </div>
                )}
            </div>
        </section>
    );
}
