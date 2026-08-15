import { Clock3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { IBlogCardProps } from "../../interfaces/IBlogCardProps";
import { useLanguageStore } from "../../store/language.store";
import LazyImg from "../LazyImg";

interface FeaturedBlogsSectionProps {
  featured: IBlogCardProps;
  related: IBlogCardProps[];
}

export default function FeaturedBlogsSection({
  featured,
  related,
}: FeaturedBlogsSectionProps) {
  const direction = useLanguageStore((s) => s.direction);

  return (
    <section
      dir={direction}
      className="w-full bg-[var(--background)] py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-10">
          {/* Related list */}
          <aside className="order-2 border border-[#E5DED1] bg-transparent lg:order-1">
            {related.slice(0, 4).map((article, index) => (
              <NavLink
                key={article.id}
                to={article.readMoreTo}
                className={[
                  "grid grid-cols-[1fr_105px] items-center gap-4",
                  "px-5 py-6",
                  "transition hover:bg-white/40",
                  index !== 3
                    ? "border-b border-[#E5DED1]"
                    : "",
                ].join(" ")}
              >
                <div className="min-w-0 text-start">
                  <p className="text-[12px] font-medium text-[var(--brand-primary-color)]">
                    {String(index + 2).padStart(2, "0")}
                    {article.category
                      ? ` · ${article.category}`
                      : ""}
                  </p>

                  <h3 className="mt-3 line-clamp-2 text-[17px] font-bold leading-[1.45] text-[#20283A]">
                    {article.title}
                  </h3>

                  {article.readTime && (
                    <p className="mt-2 text-[12px] text-[#737989]">
                      {article.readTime}
                    </p>
                  )}
                </div>

                <div className="h-[80px] w-[105px] overflow-hidden bg-[#E8E5DE]">
                  <LazyImg
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </NavLink>
            ))}
          </aside>

          {/* Featured article */}
          <NavLink
            to={featured.readMoreTo}
            className="group relative order-1 min-h-[520px] overflow-hidden bg-[#20283A] lg:order-2"
          >
            <LazyImg
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/25 to-transparent" />

            {featured.category && (
              <span
                className={[
                  "absolute start-8 top-8 z-10",
                  "bg-[var(--brand-primary-color)] px-4 py-2",
                  "text-[12px] font-bold text-[#20283A]",
                ].join(" ")}
              >
                {featured.category}
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-9 lg:p-10">
              <h2 className="max-w-[760px] text-start text-[31px] font-extrabold leading-[1.35] text-white sm:text-[38px] lg:text-[42px]">
                {featured.title}
              </h2>

              {featured.description && (
                <p className="mt-4 max-w-[650px] text-start text-[14px] leading-7 text-white/60">
                  {featured.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/50">
                {featured.readTime && (
                  <span className="flex items-center gap-2">
                    <Clock3 size={14} strokeWidth={1.6} />
                    {featured.readTime}
                  </span>
                )}

                {featured.date && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[var(--brand-primary-color)]" />
                    <span>{featured.date}</span>
                  </>
                )}

                {featured.authorName && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[var(--brand-primary-color)]" />
                    <span>{featured.authorName}</span>
                  </>
                )}
              </div>
            </div>
          </NavLink>
        </div>
      </div>
    </section>
  );
}