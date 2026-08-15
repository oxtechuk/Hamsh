import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import BlogArticleContent from "../components/blogs/BlogArticleContent";
import BlogArticleHeader from "../components/blogs/BlogArticleHeader";
import SummaryQuoteCard from "../components/blogs/SummaryQuoteCard";
import BlogDetailsLoading from "../components/blogs/BlogDetailsLoading";
import BlogDetailsError from "../components/blogs/BlogDetailsError";

import { getBlogBySlug } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { formatBlogDate, formatBlogReadTime } from "../utils/blog";
import { useSEO } from "../utils/useSEO";
import { localize } from "../utils/localize";
import { getImageUrl } from "../constants/app-images";

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
        () => (blog ? formatBlogReadTime(blog.reading_time, language) : ""),
        [blog, language],
    );

    if (isLoading) {
        return <BlogDetailsLoading />;
    }

    if (isError || !blog) {
        return <BlogDetailsError />;
    }

    const category =
        blog.categories
            .map((category) => localize(category.name, language))
            .join(", ") || "";

    const title = localize(blog.title, language);

    const authorName =
        localize(blog.employee?.name, language) ||
        t("blogPage.hero.defaultAuthor", "فهد العتيبي");

    const image = getImageUrl(blog.thumbnail) || "/images/blog.png";

    return (
        <main dir={direction} className="w-full bg-[var(--background)]">
            {/* Hero */}
            <BlogArticleHeader
                category={category}
                title={title}
                readTime={readTime}
                date={date}
                authorName={authorName}
                image={image}
            />

            {/* Article */}
            <section className="w-full py-10 sm:py-12 lg:py-14">
                <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
                    {/* Metadata */}
                    <ArticleMeta
                        authorName={authorName}
                        date={date}
                        readTime={readTime}
                    />

                    {/* Separator */}
                    <div className="mt-5 h-px w-full bg-[#E5DED1]" />

                    {/* Content */}
                    <div className="mt-10">
                        <BlogArticleContent
                            content={blog.content}
                            contentItems={blog.content_items}
                        />
                    </div>

                    {/* Summary */}
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

interface ArticleMetaProps {
    authorName: string;
    date: string;
    readTime: string;
}

function ArticleMeta({ authorName, date, readTime }: ArticleMetaProps) {
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
