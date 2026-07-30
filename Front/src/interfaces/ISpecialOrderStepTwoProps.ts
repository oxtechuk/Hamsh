import type { ISpecialOrderCarDetails } from "./ISpecialOrderTypes";

export interface ISpecialOrderStepTwoProps {
  data: ISpecialOrderCarDetails;
  onChange: <K extends keyof ISpecialOrderCarDetails>(k: K, v: ISpecialOrderCarDetails[K]) => void;
  onNext: () => void;
  onBack: () => void;
}
