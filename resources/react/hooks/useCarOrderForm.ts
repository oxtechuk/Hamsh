import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getCities, submitBooking } from "../services/api";
import {
    CAR_ORDER_STATIC_CITIES,
    EMPTY_CAR_ORDER_FORM,
} from "../constants/car-order.constants";

import type { CarDetails } from "../types/cars.types";
import type { ICarOrderFormData } from "../interfaces/ICarOrderModalProps";

export function useCarOrderForm(car: CarDetails) {
    const { t } = useTranslation();

    const [step, setStep] = useState<1 | 2>(1);
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<ICarOrderFormData>(EMPTY_CAR_ORDER_FORM);

    const { data: citiesData = [] } = useQuery({
        queryKey: ["cities"],
        queryFn: getCities,
        staleTime: 10 * 60 * 1000,
    });

    const cityOptions =
        citiesData.length > 0
            ? citiesData.map((city) => city.name)
            : CAR_ORDER_STATIC_CITIES;

    const setField = <K extends keyof ICarOrderFormData>(
        key: K,
        value: ICarOrderFormData[K],
    ) => {
        setForm((previous) => ({ ...previous, [key]: value }));
    };

    const canContinueStep1 = Boolean(
        form.fullName.trim() && form.city.trim() && form.phone.trim(),
    );

    const canSubmitStep2 = Boolean(form.salary.trim() && form.workSector);

    const eligibility = useMemo(() => {
        const salary = Number(form.salary) || 0;
        const obligations = Number(form.obligations) || 0;
        if (salary <= 0) return 40;
        const ratio = obligations / salary;
        return Math.max(5, Math.min(95, Math.round(100 - ratio * 100)));
    }, [form.salary, form.obligations]);

    const handleStep1Submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canContinueStep1) return;
        setStep(2);
    };

    const handleStep2Submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmitStep2) return;

        setSubmitting(true);

        try {
            const notes = [
                form.salary
                    ? `${t("carDetails.modal.notes.salary")}: ${form.salary}`
                    : "",
                form.workSector
                    ? `${t("carDetails.modal.notes.workSector")}: ${t(`carDetails.modal.workSector.${form.workSector}`)}`
                    : "",
                form.obligations
                    ? `${t("carDetails.modal.notes.obligations")}: ${form.obligations}`
                    : "",
            ]
                .filter(Boolean)
                .join(" | ");

            await submitBooking({
                client_name: form.fullName,
                client_phone: form.phone,
                client_email: form.email || undefined,
                city: form.city,
                car_id: car.id,
                down_payment: 0,
                booking_type: "purchase",
                notes,
            });

            setDone(true);
        } catch {
            toast.error(t("specialOrder.error.submitFailed"));
        } finally {
            setSubmitting(false);
        }
    };

    return {
        step,
        setStep,
        done,
        submitting,
        form,
        cityOptions,
        setField,
        canContinueStep1,
        canSubmitStep2,
        eligibility,
        handleStep1Submit,
        handleStep2Submit,
    };
}
