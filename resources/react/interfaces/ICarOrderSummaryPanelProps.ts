import type { LucideIcon } from "lucide-react";
import type { CarDetails } from "../types/cars.types";

export interface ICarOrderStepMeta {
  number: 1 | 2;
  label: string;
  icon: LucideIcon;
}

export interface ICarOrderSummaryPanelProps {
  car: CarDetails;
  step: 1 | 2;
  done: boolean;
  steps: ICarOrderStepMeta[];
}
