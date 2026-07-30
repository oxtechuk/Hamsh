import { useTranslation } from "react-i18next";
import type { ISummaryQuoteCardProps } from "../../interfaces/ISummaryQuoteCardProps";
import { Quote } from "lucide-react";

export default function SummaryQuoteCard({ summary }: ISummaryQuoteCardProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex overflow-hidden rounded-[12px] border border-[#ECECEC] bg-[#F9F9F9]">
      <div className="w-[5px] shrink-0 bg-[var(--brand-secondary-color)]" />
      <div className="px-6 py-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[18px] font-extrabold text-[#111111]">
            {t("blogPage.details.summary.heading")}
          </span>
          <span className="text-[22px] font-black leading-none text-[var(--brand-secondary-color)]">
            <Quote size={24} strokeWidth={1.8} className="text-[#B42225]" />
          </span>
        </div>
        <p className="text-[15px] leading-relaxed text-[#7A7A7A]">
          &ldquo;{summary}&rdquo;
        </p>
      </div>
    </div>
  );
}
