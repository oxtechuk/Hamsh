import BlogCard from "./BlogCard";
import type { IRelatedArticlesSectionProps } from "../../interfaces/IRelatedArticlesSectionProps";
import { useLanguageStore } from "../../store/language.store";

export default function RelatedArticlesSection({
  title,
  articles,
}: IRelatedArticlesSectionProps) {
  const direction = useLanguageStore((s) => s.direction);
  return (
    <section dir={direction} className="w-full py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-start text-[28px] text-[#07111F]">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}
