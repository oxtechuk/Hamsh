import type { CarDetails } from "../types/cars.types";
import type { ISpecItem } from "./ICarDetailsSpecsProps";

export type CarDetailsModalTab = "specs" | "features";

export interface ICarDetailsInfoPanelProps {
  car: CarDetails;
  activeTab: CarDetailsModalTab;
  specRows: ISpecItem[];
  featureRows: ISpecItem[];
  onChangeTab: (tab: CarDetailsModalTab) => void;
  onCompare: () => void;
  onOrder: () => void;
}
