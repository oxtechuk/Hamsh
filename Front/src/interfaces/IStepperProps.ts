export type IStepperStep = 1 | 2 | 3;

export interface IStepCircleProps {
  number: number;
  label: string;
  active?: boolean;
  done?: boolean;
}

export interface IStepperProps {
  activeStep: IStepperStep;
}
