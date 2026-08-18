import type { IContactFormValues } from "./IContactFormValues";

export interface IContactFormProps {
    title: string;
    description: string;
    values: IContactFormValues;
    set: <K extends keyof IContactFormValues>(k: K, v: IContactFormValues[K]) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}
