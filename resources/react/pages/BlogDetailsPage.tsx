import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import ArticleMeta from "../components/blogs/ArticleMeta";
import BlogArticleContent from "../components/blogs/BlogArticleContent";
import BlogArticleHeader from "../components/blogs/BlogArticleHeader";
import BlogDetailsError from "../components/blogs/BlogDetailsError";
import BlogDetailsLoading from "../components/blogs/BlogDetailsLoading";
import SummaryQuoteCard from "../components/blogs/SummaryQuoteCard";

import { getBlogBySlug } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { formatBlogDate, formatBlogReadTime } from "../utils/blog";
import { useSEO } from "../utils/useSEO";
import { localize } from "../utils/localize";
import { getImageUrl, APP_IMAGES } from "../constants/app-images";

export default function BlogDetailsPage() {
    const { t } = useTranslation();

    useSEO(t("nav.blog"), t("blogPage.details.metaDescription"));

    const { slug } = useParams<{ slug: string }>();

    const language = useLanguageStore((state) => state.language);
    const direction = useLanguageStore((state) => state.direction);

    const {
        data: blog,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["blog", slug, language],
        queryFn: () => getBlogBySlug(slug!),
        enabled: !!slug,
    });

    const date = useMemo(
        () => (blog ? formatBlogDate(blog.published_at, language) : ""),
        [blog, language],
    );

    const readTime = useMemo(
        () => (blog ? formatBlogReadTime(blog.reading_time, t) : ""),
        [blog, t],
    );

    if (isLoading) {
        return <BlogDetailsLoading />;
    }

    if (isError || !blog) {
        return <BlogDetailsError />;
    }

    const category =
        blog.categories
            .map((c) => localize(c.name, language))
            .join(", ") || "";

    const title = localize(blog.title, language);

    const authorName =
        localize(blog.employee?.name, language) ||
        t("blogPage.hero.defaultAuthor");

    const image = getImageUrl(blog.thumbnail) || APP_IMAGES.BLOG_PLACEHOLDER;

    return (
        <main dir={direction} className="w-full bg-[var(--background)]">
            <BlogArticleHeader
                category={category}
                title={title}
                readTime={readTime}
                date={date}
                authorName={authorName}
                image={image}
            />

            <section className="w-full py-10 sm:py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ArticleMeta
                        authorName={authorName}
                        date={date}
                        readTime={readTime}
                    />

                    <div className="mt-5 h-px w-full bg-[#E5DED1]" />

                    <div className="mt-10">
                        <BlogArticleContent
                            content={blog.content}
                            contentItems={blog.content_items}
                        />
                    </div>

                    {blog.summary && (
                        <div className="my-10">
                            <SummaryQuoteCard summary={blog.summary} />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
