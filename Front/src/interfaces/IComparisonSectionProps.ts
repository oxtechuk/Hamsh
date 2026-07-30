import type { ICompareRow } from "./ICompareRow";

export interface IComparisonSectionProps {
  title: string;
  rows: ICompareRow[];
  car1Name: string;
  car2Name: string;
  carOneLabel: string;
  carTwoLabel: string;
}
