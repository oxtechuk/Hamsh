import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { submitBooking } from "../services/api";

import type {
    ISpecialOrderStep,
    ISpecialOrderPersonalInfo,
    ISpecialOrderCarDetails,
    ISpecialOrderBudget,
} from "../interfaces/ISpecialOrderTypes";

const EMPTY_PERSONAL: ISpecialOrderPersonalInfo = {
    fullName: "",
    phone: "",
    email: "",
    city: "",
    salary: "",
    obligations: "",
};

const EMPTY_CAR: ISpecialOrderCarDetails = {
    brand: "",
    model: "",
    year: "",
    color: "",
    transmission: "",
    fuelType: "",
    notes: "",
};

const EMPTY_BUDGET: ISpecialOrderBudget = {
    salaryRange: "",
    notes: "",
};

export function useSpecialOrderForm() {
    const { t } = useTranslation();

    const [step, setStep] = useState<ISpecialOrderStep>(1);
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [personal, setPersonal] =
        useState<ISpecialOrderPersonalInfo>(EMPTY_PERSONAL);
    const [car, setCar] = useState<ISpecialOrderCarDetails>(EMPTY_CAR);
    const [budget, setBudget] = useState<ISpecialOrderBudget>(EMPTY_BUDGET);

    const setPersonalField = <K extends keyof ISpecialOrderPersonalInfo>(
        key: K,
        value: ISpecialOrderPersonalInfo[K],
    ) => {
        setPersonal((previous) => ({ ...previous, [key]: value }));
    };

    const setCarField = <K extends keyof ISpecialOrderCarDetails>(
        key: K,
        value: ISpecialOrderCarDetails[K],
    ) => {
        setCar((previous) => ({ ...previous, [key]: value }));
    };

    const setBudgetField = <K extends keyof ISpecialOrderBudget>(
        key: K,
        value: ISpecialOrderBudget[K],
    ) => {
        setBudget((previous) => ({ ...previous, [key]: value }));
    };

    const buildExtraNotes = () =>
        [
            car.transmission
                ? `${t("specialOrder.notes.transmission")}: ${car.transmission}`
                : "",
            car.fuelType
                ? `${t("specialOrder.notes.fuelType")}: ${car.fuelType}`
                : "",
            car.notes
                ? `${t("specialOrder.notes.carNotes")}: ${car.notes}`
                : "",
            budget.notes
                ? `${t("specialOrder.notes.generalNotes")}: ${budget.notes}`
                : "",
            personal.salary
                ? `${t("specialOrder.notes.salary")}: ${personal.salary}`
                : "",
            personal.obligations
                ? `${t("specialOrder.notes.obligations")}: ${personal.obligations}`
                : "",
        ]
            .filter(Boolean)
            .join(" | ");

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            await submitBooking({
                client_name: personal.fullName,
                client_phone: personal.phone,
                client_email: personal.email,
                city: personal.city,

                brand_name: car.brand,
                model_name: car.model,
                model_year: car.year,
                preferred_color: car.color,

                salary_range: budget.salaryRange,

                booking_type: "inquiry",

                notes: buildExtraNotes(),
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
        personal,
        car,
        budget,
        setPersonalField,
        setCarField,
        setBudgetField,
        handleSubmit,
    };
}
