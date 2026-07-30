import type { ReactNode } from "react";

export interface ICarDetailsSpecsCardProps {
  label: string;
  value: string | null | undefined;
  icon?: ReactNode;
}

export interface ICarDetailsSpecsProps {
  tabs: import("./ICarDetailsSpecsProps").ITab[];
  embedded?: boolean;
  className?: string;
}
