import type { ReactNode } from "react";

export interface IFieldGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}
