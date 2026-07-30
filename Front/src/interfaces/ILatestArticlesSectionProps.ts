import type { IBlogCardProps } from "./IBlogCardProps";

export interface ILatestArticlesSectionProps {
  title: string;
  articles: IBlogCardProps[];
  // legacy load-more (API mode)
  loadMoreText?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  // pagination (static / page mode)
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
