import type { ICarCardProps } from "./ICarCardProps";

export interface ICarsShowcaseSectionProps {
  titleBlue: string;
  titleOrange: string;
  description: string;
  buttonText: string;
  buttonTo: string;
  cars: ICarCardProps[];
}