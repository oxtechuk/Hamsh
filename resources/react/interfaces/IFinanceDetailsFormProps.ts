import type { ISelectedCar } from "./ISelectedCar";

export interface IFinanceDetailsFormProps {
  selectedCar: ISelectedCar;
  carPrice: number;
  downPaymentPercent: number;
  setDownPaymentPercent: (v: number) => void;
  term: number;
  setTerm: (v: number) => void;
  monthlyIncome: string;
  setMonthlyIncome: (v: string) => void;
  monthlyObligations: string;
  setMonthlyObligations: (v: string) => void;
  riyal: string;
}
