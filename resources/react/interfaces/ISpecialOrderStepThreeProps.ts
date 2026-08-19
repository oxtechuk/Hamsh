import type {
  ISpecialOrderPersonalInfo,
  ISpecialOrderCarDetails,
} from "./ISpecialOrderTypes";

export interface ISpecialOrderStepThreeProps {
  personal: ISpecialOrderPersonalInfo;
  car: ISpecialOrderCarDetails;
  budget?: string;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}
