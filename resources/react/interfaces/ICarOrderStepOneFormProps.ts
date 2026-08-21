import type { FormEvent } from "react";
import type { ICarOrderFormData } from "./ICarOrderModalProps";

export interface ICarOrderStepOneFormProps {
  form: ICarOrderFormData;
  cityOptions: string[];
  canContinue: boolean;
  onFieldChange: <K extends keyof ICarOrderFormData>(
    key: K,
    value: ICarOrderFormData[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
