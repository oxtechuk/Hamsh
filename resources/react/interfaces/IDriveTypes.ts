export type IDriveStep = 1 | 2;

export interface IDriveStepperStep {
  number: number;
  label: string;
}

export interface IDriveStepperProps {
  activeStep: IDriveStep;
}
