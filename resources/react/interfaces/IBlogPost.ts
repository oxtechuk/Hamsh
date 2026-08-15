import type { IBlogApiEmployee } from "./IBlogApiEmployee";
import type { IBlogApiCategory } from "./IBlogApiCategory";

export interface IBlogPost {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  excerpt: string;
  published_at: string;
  employee: IBlogApiEmployee;
  categories: IBlogApiCategory[];
  reading_time: number;
}
