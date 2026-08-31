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

export function useCarOrderForm(car: CarDetails, initialMode: "finance" | "cash" = "finance") {
    const { t } = useTranslation();

    const [mode, setMode] = useState<"finance" | "cash">(initialMode);
    const [step, setStep] = useState<1 | 2>(initialMode === "finance" ? 2 : 1);
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<ICarOrderFormData>({
        ...EMPTY_CAR_ORDER_FORM,
        orderType: initialMode,
    });

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

    const canSubmitCash = Boolean(
        form.fullName.trim() && form.city.trim() && form.phone.trim(),
    );

    const canSubmitFinance = Boolean(
        form.fullName.trim() &&
        form.phone.trim() &&
        form.city.trim() &&
        form.workSector &&
        form.salary.trim(),
    );

    // Calculate DBR and Acceptance Score
    const dbrAnalysis = useMemo(() => {
        const salary = Number(form.salary) || 0;
        const obligations = Number(form.obligations) || 0;

        if (salary <= 0) {
            return {
                dbrRatio: 0,
                isExceeded: false,
                score: null as number | null,
                scoreLabel: "—",
                colorClass: "bg-gray-300",
                textClass: "text-gray-600",
                barColor: "#E2E8F0",
                status: "empty",
            };
        }

        const dbrRatio = Math.round((obligations / salary) * 100);
        const isExceeded = dbrRatio > 45;

        if (isExceeded) {
            return {
                dbrRatio,
                isExceeded: true,
                score: 32,
                scoreLabel: "32%",
                colorClass: "bg-[#C81E1E]",
                textClass: "text-[#C81E1E]",
                barColor: "#C81E1E",
                status: "high_dbr",
            };
        }

        if (dbrRatio > 33) {
            const score = Math.max(45, Math.min(75, 100 - dbrRatio));
            return {
                dbrRatio,
                isExceeded: false,
                score,
                scoreLabel: `${score}%`,
                colorClass: "bg-[#D97706]",
                textClass: "text-[#D97706]",
                barColor: "#D97706",
                status: "medium_dbr",
            };
        }

        const score = Math.max(80, Math.min(95, 100 - dbrRatio));
        return {
            dbrRatio,
            isExceeded: false,
            score,
            scoreLabel: `${score}%`,
            colorClass: "bg-[#16A34A]",
            textClass: "text-[#16A34A]",
            barColor: "#16A34A",
            status: "good_dbr",
        };
    }, [form.salary, form.obligations]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (mode === "cash" && !canSubmitCash) return;
        if (mode === "finance" && !canSubmitFinance) return;

        setSubmitting(true);

        try {
            const notes = [
                mode === "finance" ? "طلب تمويل سيارة" : "طلب شراء كاش مباشر",
                form.salary ? `الدخل الشهري: ${form.salary} ر.س` : "",
                form.workSector ? `جهة العمل: ${form.workSector}` : "",
                form.obligations ? `الالتزامات: ${form.obligations} ر.س` : "",
                dbrAnalysis.score !== null ? `مؤشر القبول: ${dbrAnalysis.scoreLabel} (نسبة الاستقطاع: ${dbrAnalysis.dbrRatio}%)` : "",
                form.consolidateDebts ? "يرغب في الاستفادة من خيار الحلول التمويلية وتوحيد الالتزامات" : "",
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
                booking_type: mode === "finance" ? "finance" : "purchase",
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
        mode,
        setMode,
        step,
        setStep,
        done,
        submitting,
        form,
        cityOptions,
        setField,
        canSubmitCash,
        canSubmitFinance,
        dbrAnalysis,
        handleFormSubmit,
    };
}
