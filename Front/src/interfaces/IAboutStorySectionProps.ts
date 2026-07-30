import type { ReactNode } from "react";

export interface IAboutValueItem {
  id: string | number;
  title: string;
  description: string;
  icon?: ReactNode;
  variant?: "light" | "dark";
}

export interface IAboutStorySectionProps {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  primaryImage: string;
  secondaryImage: string;
  statValue?: string;
  statLabel?: string;
  values?: IAboutValueItem[];
  className?: string;
}
