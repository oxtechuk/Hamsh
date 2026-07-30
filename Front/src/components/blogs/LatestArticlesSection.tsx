import { useTranslation } from "react-i18next";
import BlogCard from "./BlogCard";
import PaginationBar from "./PaginationBar";
import type { ILatestArticlesSectionProps } from "../../interfaces/ILatestArticlesSectionProps";

export default function LatestArticlesSection({
  articles,
  loadMoreText,
  hasMore,
  onLoadMore,
  currentPage,
  totalPages,
  onPageChange,
}: ILatestArticlesSectionProps) {
  const { i18n } = useTranslation();

  const showPagination =
    totalPages !== undefined &&
    totalPages > 1 &&
    onPageChange &&
    currentPage !== undefined;

  return (
    <section dir={i18n.dir()} className="w-full py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogCard key={article.id} {...article} />
          ))}
        </div>

        {/* Load-more (API mode) */}
        {hasMore && onLoadMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={onLoadMore}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-bold text-[#07111F] transition hover:bg-[var(--brand-secondary-color)] hover:text-white"
            >
              {loadMoreText}
            </button>
          </div>
        )}

        {/* Numbered pagination (static mode) */}
        {showPagination && (
          <PaginationBar
            currentPage={currentPage!}
            totalPages={totalPages!}
            onPageChange={onPageChange!}
          />
        )}
      </div>
    </section>
  );
}
