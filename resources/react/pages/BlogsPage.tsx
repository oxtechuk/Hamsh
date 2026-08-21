import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import BlogsPageHero from "../components/blogs/BlogsPageHero";
import FeaturedBlogsSection from "../components/blogs/FeaturedBlogsSection";
import LatestArticlesSection from "../components/blogs/LatestArticlesSection";
import BlogsPageSkeleton from "../components/BlogsPageSkeleton";
import { getBlogs } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { postToCardProps } from "../utils/blog";
import { localize } from "../utils/localize";
import { useSEO } from "../utils/useSEO";

const PER_PAGE = 6;

export default function BlogsPage() {
    const { t } = useTranslation();
    useSEO(t("nav.blog"), t("blogPage.hero.description"));
    const language = useLanguageStore((s) => s.language);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState(
        searchParams.get("category") || "all",
    );

    const categoryId =
        activeCategory === "all" ? undefined : Number(activeCategory);

    const {
        data: blogResponse,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
    } = useInfiniteQuery({
        placeholderData: keepPreviousData,
        queryKey: ["blogs", language, categoryId ?? "all"],
        queryFn: ({ pageParam }) =>
            getBlogs(pageParam as number, PER_PAGE, categoryId),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.current_page < lastPage.meta.last_page
                ? lastPage.meta.current_page + 1
                : undefined,
    });

    const categories = useMemo(() => {
        const apiCategories = blogResponse?.pages?.[0]?.meta.categories ?? [];
        if (!apiCategories.length) return [];
        return [
            { label: t("blogPage.hero.allCategories"), value: "all" },
            ...apiCategories.map((c) => ({
                label: localize(c.name, language),
                value: String(c.id),
            })),
        ];
    }, [blogResponse, language]);

    const apiArticles = useMemo(() => {
        if (!blogResponse?.pages) return [];
        return blogResponse.pages
            .flatMap((page) => page.data)
            .map((post) => postToCardProps(post, language, t));
    }, [blogResponse, language, t]);

    const handleCategoryChange = useCallback(
        (val: string) => {
            setActiveCategory(val);
            if (val === "all") {
                setSearchParams({});
            } else {
                setSearchParams({ category: val });
            }
        },
        [setSearchParams],
    );

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const featuredPosts = useMemo(() => {
        const posts = blogResponse?.pages?.[0]?.meta.featured_posts ?? [];
        return posts.map((post) => postToCardProps(post, language, t));
    }, [blogResponse, language, t]);

    const featuredArticle = featuredPosts[0];
    const relatedArticles = featuredPosts.slice(1, 5);

    if (isPending) {
        return <BlogsPageSkeleton />;
    }

    return (
        <>
            <BlogsPageHero
                badgeText={t("blogPage.hero.badge")}
                title={t("blogPage.hero.title")}
                description={t("blogPage.hero.description")}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />

            {featuredArticle && (
                <FeaturedBlogsSection
                    featured={featuredArticle}
                    related={relatedArticles}
                />
            )}

            {/* {apiArticles.length > 0 && (
                <LatestArticlesSection
                    articles={apiArticles}
                    hasMore={hasNextPage}
                    onLoadMore={handleLoadMore}
                    loadMoreText={t("blogPage.loadMore")}
                />
            )} */}
        </>
    );
}
