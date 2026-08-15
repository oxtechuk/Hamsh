import type { ISpecialOrderPersonalInfo } from "./ISpecialOrderTypes";

export interface ISpecialOrderStepOneProps {
  data: ISpecialOrderPersonalInfo;
  onChange: <K extends keyof ISpecialOrderPersonalInfo>(k: K, v: ISpecialOrderPersonalInfo[K]) => void;
  onNext: () => void;
  hideEmail?: boolean;
}
