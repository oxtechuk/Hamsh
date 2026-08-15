import type { MouseEvent, ReactNode } from "react";

export interface IButtonProps {
  children: ReactNode;
  textColor?: string;
  bgColor?: string;
  to?: string;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}
