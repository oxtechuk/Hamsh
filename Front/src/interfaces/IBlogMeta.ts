import type { IBlogHero } from "./IBlogHero";
import type { IBlogPost } from "./IBlogPost";
import type { IBlogApiCategory } from "./IBlogApiCategory";

export interface IBlogMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  hero: IBlogHero;
  featured_posts: IBlogPost[];
  categories: IBlogApiCategory[];
}
