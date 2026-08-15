import type { ICarCardProps } from "./ICarCardProps";
import type { IBudgetRange } from "./IBudgetRange";

export interface IBudgetCarsSectionProps {
    titleBlue: string;
    description: string;
    buttonText: string;
    buttonTo: string;
    cars: ICarCardProps[];
    ranges?: IBudgetRange[];
    activeRange?: string;
    onRangeChange?: (value: string) => void;
}
