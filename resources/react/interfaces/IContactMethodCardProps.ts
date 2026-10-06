import type { ReactNode } from "react";

export interface IContactMethodCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
  transparent?: boolean;
  id?: string;
  className?: string;
  dataTracking?: string;
  dataId?: string;
  dataChannel?: string;
  ariaLabel?: string;
  onClick?: () => void;
}
