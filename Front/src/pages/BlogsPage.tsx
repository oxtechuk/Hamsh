import { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import BlogsPageHero from "../components/blogs/BlogsPageHero";
import LatestArticlesSection from "../components/blogs/LatestArticlesSection";
import { getBlogs } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { postToCardProps } from "../utils/blog";
import { localize } from "../utils/localize";
import { useSEO } from "../utils/useSEO";
import { STATIC_ARTICLES, STATIC_CATEGORIES } from "../data/blog-static-data";

const PER_PAGE = 6;

export default function BlogsPage() {
  const { t } = useTranslation();
  useSEO(t("nav.blog"), t("blogPage.hero.description"));
  const language = useLanguageStore((s) => s.language);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [staticPage, setStaticPage] = useState(1);
  const hasEverHadApiData = useRef(false);

  const categoryId = activeCategory === "all" ? undefined : Number(activeCategory);

  const {
    data: blogResponse,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    placeholderData: keepPreviousData,
    queryKey: ["blogs", language, categoryId ?? "all"],
    queryFn: ({ pageParam }) => getBlogs(pageParam as number, PER_PAGE, categoryId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });

  const isApiData = !!(blogResponse?.pages?.[0]?.data?.length);
  if (isApiData) hasEverHadApiData.current = true;

  const categories = useMemo(() => {
    const apiCategories = blogResponse?.pages?.[0]?.meta.categories ?? [];
    if (!apiCategories.length) return STATIC_CATEGORIES;
    return [
      { label: t("blogPage.hero.allCategories"), value: "all" },
      ...apiCategories.map((c) => ({ label: localize(c.name, language), value: String(c.id) })),
    ];
  }, [blogResponse, language]);

  const apiArticles = useMemo(() => {
    if (!blogResponse?.pages) return [];
    return blogResponse.pages.flatMap((page) => page.data).map((post) =>
      postToCardProps(post, language, t),
    );
  }, [blogResponse, language, t]);

  const filteredStatic = useMemo(() => {
    if (activeCategory === "all") return STATIC_ARTICLES;
    return STATIC_ARTICLES.filter((a) => {
      const cat = STATIC_CATEGORIES.find((c) => c.value === activeCategory);
      return cat ? a.category === cat.label : true;
    });
  }, [activeCategory]);

  const staticTotalPages = Math.ceil(filteredStatic.length / PER_PAGE);
  const staticPageArticles = filteredStatic.slice(
    (staticPage - 1) * PER_PAGE,
    staticPage * PER_PAGE,
  );

  const handleCategoryChange = useCallback((val: string) => {
    setActiveCategory(val);
    setStaticPage(1);
    if (val === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: val });
    }
  }, [setSearchParams]);

  const handlePageChange = useCallback((page: number) => {
    setStaticPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showStaticFallback = !isApiData && !hasEverHadApiData.current;

  return (
    <>
      <BlogsPageHero
        badgeText={localize(blogResponse?.pages?.[0]?.meta.hero.badge, language) || t("blogPage.hero.badge")}
        title={localize(blogResponse?.pages?.[0]?.meta.hero.title, language) || t("blogPage.hero.title")}
        description={localize(blogResponse?.pages?.[0]?.meta.hero.subtitle, language) || t("blogPage.hero.description")}
      />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="w-full pb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {categories.map((category) => {
                const isActive = category.value === activeCategory;
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategoryChange(category.value)}
                    className={[
                      "flex min-h-[38px] items-center justify-center",
                      "rounded-[4px] px-5",
                      "text-[13px] font-bold",
                      "transition duration-300",
                      isActive
                        ? "bg-[#C5232B] text-white shadow-[0_5px_14px_rgba(197,35,43,0.14)]"
                        : "bg-[#F2F2F2] text-[#858589] hover:bg-[#E8E8E8] hover:text-[#C5232B]",
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {showStaticFallback ? (
        <LatestArticlesSection
          title={t("blogPage.latestArticles.title")}
          articles={staticPageArticles}
          currentPage={staticPage}
          totalPages={staticTotalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <LatestArticlesSection
          title={t("blogPage.latestArticles.title")}
          articles={apiArticles}
          loadMoreText={isFetchingNextPage ? t("blogPage.latestArticles.loading") : t("blogPage.latestArticles.loadMore")}
          hasMore={!!hasNextPage}
          onLoadMore={handleLoadMore}
        />
      )}
    </>
  );
}
