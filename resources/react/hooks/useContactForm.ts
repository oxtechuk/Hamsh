import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { submitContactForm } from "../services/api/contact.service";
import type { IContactFormValues } from "../interfaces/IContactFormValues";

const EMPTY_FORM: IContactFormValues = {
    fullName: "",
    phone: "",
    subject: "",
    message: "",
};

export function useContactForm() {
    const { t } = useTranslation();
    const [values, setValues] = useState<IContactFormValues>(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const set = <K extends keyof IContactFormValues>(
        k: K,
        v: IContactFormValues[K],
    ) => setValues((p: IContactFormValues) => ({ ...p, [k]: v }));

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitContactForm({
                name: values.fullName,
                phone: values.phone,
                subject: values.subject,
                message: values.message,
            });
            toast.success(t("contactPage.contactUs.successToast"));
            setValues(EMPTY_FORM);
        } catch {
            toast.error(t("contactPage.contactUs.errorToast"));
        } finally {
            setIsSubmitting(false);
        }
    }, [values, t]);

    return {
        values,
        set,
        isSubmitting,
        handleSubmit,
    };
}
