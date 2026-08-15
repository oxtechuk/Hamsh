import type { ReactNode } from "react";

export interface IContactPageLayoutProps {
  form: ReactNode;
  map: ReactNode;
  faq?: ReactNode;
  bottomContent?: ReactNode;
  className?: string;
}
