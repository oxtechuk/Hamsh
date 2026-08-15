import type { ReactNode } from "react";

export interface IPagBtnProps {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
