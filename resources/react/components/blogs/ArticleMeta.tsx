import type { IArticleMetaProps } from "../../interfaces/IArticleMetaProps";

export default function ArticleMeta({ authorName, date, readTime }: IArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-x-5 gap-y-3 text-[12px] text-[#687084]">
      {authorName && (
        <span className="font-bold text-[#303A54]">{authorName}</span>
      )}

      {date && (
        <>
          <span className="h-[4px] w-[4px] rounded-full bg-[var(--brand-primary-color)]" />
          <span>{date}</span>
        </>
      )}

      {readTime && (
        <>
          <span className="h-[4px] w-[4px] rounded-full bg-[var(--brand-primary-color)]" />
          <span>{readTime}</span>
        </>
      )}
    </div>
  );
}
