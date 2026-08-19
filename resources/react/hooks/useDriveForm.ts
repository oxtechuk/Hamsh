import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import { getCars, submitBooking } from "../services/api";
import { localize } from "../utils/localize";

import type { CarItem } from "../types/home.types";
import type { IDrivePersonalInfo } from "../interfaces/IDrivePersonalInfo";
import type { IDriveStep } from "../interfaces/IDriveTypes";

const EMPTY_PERSONAL: IDrivePersonalInfo = {
    fullName: "",
    phone: "",
    city: "",
    salary: "",
    obligations: "",
};

export function useDriveForm() {
    const { t, i18n } = useTranslation();

    const [step, setStep] = useState<IDriveStep>(1);
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [personal, setPersonal] =
        useState<IDrivePersonalInfo>(EMPTY_PERSONAL);
    const [selectedCar, setSelectedCar] = useState<CarItem | null>(null);

    const { data: carsResponse, isLoading } = useQuery({
        queryKey: ["drive-cars", i18n.language],
        queryFn: () => getCars(),
        staleTime: 5 * 60 * 1000,
    });

    const cars = carsResponse?.data ?? [];

    const setPersonalField = (
        key: keyof IDrivePersonalInfo,
        value: string,
    ) => {
        setPersonal((previous) => ({ ...previous, [key]: value }));
    };

    const selectedCarLabel = selectedCar
        ? `${localize(selectedCar.brand?.name, i18n.language)} ${localize(
              selectedCar.name,
              i18n.language,
          )}`.trim()
        : "";

    const handleSubmit = async () => {
        if (!selectedCar) {
            return;
        }

        setSubmitting(true);

        try {
            const extraNotes = [
                personal.salary
                    ? `${t("drivePage.notes.salary")}: ${personal.salary}`
                    : "",
                personal.obligations
                    ? `${t("drivePage.notes.obligations")}: ${personal.obligations}`
                    : "",
            ]
                .filter(Boolean)
                .join(" | ");

            await submitBooking({
                client_name: personal.fullName,
                client_phone: personal.phone,
                city: personal.city,
                car_id: selectedCar.id,
                down_payment: 0,
                booking_type: "test_drive",
                notes: extraNotes,
            });

            setDone(true);
        } catch {
            toast.error(t("drivePage.error.submitFailed"));
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
        setPersonalField,
        selectedCar,
        setSelectedCar,
        selectedCarLabel,
        cars,
        isLoading,
        handleSubmit,
    };
}
