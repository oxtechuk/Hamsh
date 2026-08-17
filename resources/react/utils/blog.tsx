import { getImageUrl, APP_IMAGES } from "../constants/app-images";
import { localize } from "./localize";
import type { IBlogPost } from "../interfaces/IBlogPost";
import type { TFunction } from "i18next";

export function formatBlogDate(iso: string, language: string): string {
  const date = new Date(iso);
  const locale = language === "ar" ? "ar-SA" : "en-US";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatBlogReadTime(minutes: number, t: TFunction): string {
  if (minutes < 1) return t("blogPage.readTime.lessThanMinute");
  if (minutes === 1) return t("blogPage.readTime.oneMinute");
  if (minutes === 2) return t("blogPage.readTime.twoMinutes");
  return t("blogPage.readTime.minutes", { count: minutes });
}

export function postToCardProps(
  post: IBlogPost,
  language: string,
  t: TFunction,
) {
  return {
    id: post.id,
    image: getImageUrl(post.thumbnail) || APP_IMAGES.BLOG_PLACEHOLDER,
    category:
      post.categories.map((c) => localize(c.name, language)).join(", ") ||
      t("blogPage.hero.featuredPost.category"),
    date: formatBlogDate(post.published_at, language),
    readTime: formatBlogReadTime(post.reading_time, t),
    title: localize(post.title, language) || t("blogPage.hero.featuredPost.title"),
    description: localize(post.excerpt, language) || t("blogPage.hero.featuredPost.description"),
    authorName:
      localize(post.employee.name, language) || t("blogPage.hero.featuredPost.author.name"),
    authorRole:
      localize(post.employee.role, language) || t("blogPage.hero.featuredPost.author.role"),
    authorImage:
      getImageUrl(post.employee.avatar) || APP_IMAGES.BLOG_AUTHOR_PLACEHOLDER,
    readMoreTo: `/blog/${post.slug}`,
  };
}
