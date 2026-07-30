export interface IBlogApiCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  posts_count?: number;
}
