import type { IBlogCardProps } from "./IBlogCardProps";

export interface ILatestArticlesSectionProps {
  articles: IBlogCardProps[];
  loadMoreText?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
