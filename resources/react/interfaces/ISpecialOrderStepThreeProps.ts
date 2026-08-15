import type { ISpecialOrderBudget } from "./ISpecialOrderTypes";

export interface ISpecialOrderStepThreeProps {
  data: ISpecialOrderBudget;
  onChange: <K extends keyof ISpecialOrderBudget>(k: K, v: ISpecialOrderBudget[K]) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}
