import type { ReactNode } from "react";
import type { IContactBranchItem } from "./IContactBranchItem";

export interface IContactPageLayoutProps {
  form: ReactNode;
  faq: ReactNode;
  branches?: IContactBranchItem[];
}
