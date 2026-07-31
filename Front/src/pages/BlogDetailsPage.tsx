import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import BlogArticleContent from "../components/blogs/BlogArticleContent";
import BlogArticleHeader from "../components/blogs/BlogArticleHeader";
import BlogTableOfContents from "../components/blogs/BlogTableOfContents";
import BlogSidebarCta from "../components/blogs/BlogSidebarCta";
import BlogSidebarRelated from "../components/blogs/BlogSidebarRelated";
import SummaryQuoteCard from "../components/blogs/SummaryQuoteCard";
import BlogDetailsLoading from "../components/blogs/BlogDetailsLoading";
import BlogDetailsError from "../components/blogs/BlogDetailsError";

import { getBlogBySlug } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { formatBlogDate, formatBlogReadTime, postToCardProps } from "../utils/blog";
import { useSEO } from "../utils/useSEO";
import { localize } from "../utils/localize";
import { useTocObserver } from "../hooks/useTocObserver";
import type { IBlogPost } from "../interfaces/IBlogPost";
import type { ITocItem } from "../interfaces/ITocItem";

export default function BlogDetailsPage() {
  const { t } = useTranslation();
  useSEO(t("nav.blog"), t("blogPage.details.metaDescription"));
  const { slug } = useParams<{ slug: string }>();
  const language = useLanguageStore((s) => s.language);
  const direction = useLanguageStore((s) => s.direction);

  const { data: blog, isLoading, isError } = useQuery({
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
  const relatedArticles = useMemo(
    () => blog?.related_posts?.map((post: IBlogPost) => postToCardProps(post, language, t)) ?? [],
    [blog, language, t],
  );

  const tocItems: ITocItem[] = useMemo(
    () =>
      (blog?.content_items ?? []).map((item, i) => ({
        id: `heading-${i}`,
        text: item.title,
        index: i + 1,
      })),
    [blog?.content_items],
  );

  const { activeId, scrollTo } = useTocObserver(tocItems);

  if (isLoading) return <BlogDetailsLoading />;
  if (isError || !blog) return <BlogDetailsError />;

  const category =
    blog.categories.map((c) => localize(c.name, language)).join(", ") || "";
  const title = localize(blog.title, language);

  return (
    <main dir={direction} className="w-full bg-[#FAFAF8] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* ── ARTICLE ── */}
          <div>
            <BlogArticleHeader
              category={category}
              title={title}
              readTime={readTime}
              date={date}
            />

            {blog.summary && <SummaryQuoteCard summary={blog.summary} />}

            {/* ── TOC (mobile only) ── */}
            <div className="mt-6 lg:hidden">
              <BlogTableOfContents
                items={tocItems}
                activeId={activeId}
                onClickItem={scrollTo}
              />
            </div>

            <div className="mt-6 px-1">
              <BlogArticleContent
                content={blog.content}
                contentItems={blog.content_items}
              />
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="space-y-5 lg:sticky lg:top-[110px]">
            <div className="hidden lg:block">
              <BlogTableOfContents
                items={tocItems}
                activeId={activeId}
                onClickItem={scrollTo}
              />
            </div>
            <BlogSidebarCta />
            <BlogSidebarRelated articles={relatedArticles} />
          </aside>

        </div>
      </div>
    </main>
  );
}
