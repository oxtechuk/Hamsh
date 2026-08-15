export interface IBreadcrumbItem {
  label: string;
  to?: string;
}

export interface IPageBreadcrumbHeaderProps {
  title: string;
  breadcrumbs?: IBreadcrumbItem[];
  className?: string;
}
