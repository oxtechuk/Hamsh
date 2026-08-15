export interface IPaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
