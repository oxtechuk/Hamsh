import type { FormEvent } from "react";
import type { ICarOrderFormData } from "./ICarOrderModalProps";

export interface ICarOrderStepTwoFormProps {
  form: ICarOrderFormData;
  eligibility: number;
  canSubmit: boolean;
  submitting: boolean;
  onFieldChange: <K extends keyof ICarOrderFormData>(
    key: K,
    value: ICarOrderFormData[K],
  ) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
