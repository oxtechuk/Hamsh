import type { IBlogCategory } from "./IBlogCategory";
import type { IBlogFeaturedCardProps } from "./IBlogFeaturedCardProps";

export interface IBlogsPageHeroProps {
  badgeText: string;
  title: string;
  description: string;
  featuredPost?: IBlogFeaturedCardProps;
}
