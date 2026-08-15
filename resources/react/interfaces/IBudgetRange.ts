import type { ReactNode } from "react";

export interface IBudgetRange {
    label: ReactNode;
    value: string;
    min?: number;
    max?: number | null;
    count?: number;
}
