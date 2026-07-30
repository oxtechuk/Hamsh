import { CalendarDays, Clock } from "lucide-react";
import type { IBlogArticleHeaderProps } from "../../interfaces/IBlogArticleHeaderProps";

export default function BlogArticleHeader({
  category,
  title,
  readTime,
  date,
}: IBlogArticleHeaderProps) {
  return (
    <div className="rounded-[16px] border border-[#ECECEC] bg-white px-6 py-7 shadow-sm sm:px-10">
      {category && (
        <span className="inline-flex items-center rounded-[6px] bg-[var(--brand-secondary-color)] px-3 py-1 text-[12px] font-semibold text-white">
          {category}
        </span>
      )}
      <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-[#111111] sm:text-[34px]">
        {title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#9CA3AF]">
        <span className="flex items-center gap-1.5">
          <Clock size={14} strokeWidth={1.8} />
          {readTime}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays size={14} strokeWidth={1.8} />
          {date}
        </span>
      </div>
    </div>
  );
}
