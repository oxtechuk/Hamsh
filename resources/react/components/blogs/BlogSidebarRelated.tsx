import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";
import LazyImg from "../LazyImg";
import type { IBlogSidebarRelatedProps } from "../../interfaces/IBlogSidebarRelatedProps";

export default function BlogSidebarRelated({ articles }: IBlogSidebarRelatedProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  if (articles.length === 0) return null;

  return (
    <div dir={direction} className="rounded-[14px] border border-[#ECECEC] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111111]">
        {t("blogPage.sidebar.relatedTitle")}
      </h3>
      <div className="space-y-4">
        {articles.slice(0, 4).map((article) => (
          <NavLink
            key={article.id}
            to={article.readMoreTo}
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <LazyImg
              src={article.image}
              alt={article.title}
              className="h-[52px] w-[72px] shrink-0 rounded-[8px] object-cover"
            />
            <p className="flex-1 text-start text-[13px] font-bold leading-snug text-[#111111] line-clamp-2">
              {article.title}
            </p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
