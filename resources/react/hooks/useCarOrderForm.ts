import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getCities, submitBooking } from "../services/api";
import {
    getCalculatorSettings,
    sendCalculatorOtp,
    verifyCalculatorOtp,
} from "../services/api/calculator.service";
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
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [form, setForm] = useState<ICarOrderFormData>({
        ...EMPTY_CAR_ORDER_FORM,
        orderType: initialMode,
    });

    const { data: citiesData = [] } = useQuery({
        queryKey: ["cities"],
        queryFn: getCities,
        staleTime: 10 * 60 * 1000,
    });

    const { data: calcSettings } = useQuery({
        queryKey: ["calculator-settings"],
        queryFn: getCalculatorSettings,
        staleTime: 10 * 60 * 1000,
    });

    const otpEnabled = Boolean(calcSettings?.otp_enabled);

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

    const handleSendOtp = async () => {
        if (!form.phone.trim() || form.phone.length < 9) {
            toast.error(t("financeCalculator.validation.validPhone", { defaultValue: "يرجى إدخال رقم جوال صحيح أولاً" }));
            return;
        }

        setSendingOtp(true);
        try {
            await sendCalculatorOtp(form.phone.trim());
            setOtpSent(true);
            toast.success(t("financeCalculator.otp.sentSuccess", { defaultValue: "تم إرسال رمز التحقق بنجاح" }));
        } catch {
            toast.error(t("financeCalculator.otp.sendFailed", { defaultValue: "فشل إرسال رمز التحقق، يرجى المحاولة لاحقاً" }));
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!form.otpCode?.trim()) {
            toast.error(t("financeCalculator.otp.enterCode", { defaultValue: "يرجى إدخال رمز التحقق" }));
            return;
        }

        setVerifyingOtp(true);
        try {
            await verifyCalculatorOtp(form.phone.trim(), form.otpCode.trim(), form.fullName.trim());
            setOtpVerified(true);
            setField("otpVerified", true);
            toast.success(t("financeCalculator.otp.verifiedSuccess", { defaultValue: "تم التحقق من رقم الجوال بنجاح" }));
        } catch {
            toast.error(t("financeCalculator.otp.invalidCode", { defaultValue: "رمز التحقق غير صحيح أو منتهي الصلاحية" }));
        } finally {
            setVerifyingOtp(false);
        }
    };

    const canSubmitCash = Boolean(
        form.fullName.trim() &&
        form.city.trim() &&
        form.phone.trim() &&
        (!otpEnabled || otpVerified),
    );

    const canSubmitFinance = Boolean(
        form.fullName.trim() &&
        form.phone.trim() &&
        form.salary.trim() &&
        (!otpEnabled || otpVerified),
    );

    // Calculate DBR and Acceptance Score based on obligations limit (45% for none/personal, 65% for real estate)
    const dbrAnalysis = useMemo(() => {
        const salary = Number(form.salary) || 0;
        const maxLimit = form.obligationType === "real_estate_personal" ? 65 : 45;
        const carInstallment = Number(car.min_installment) || (car.cash_price ? Math.round(car.cash_price / 60) : 0);
        const obligations = form.obligationType === "none" ? 0 : (Number(form.obligations) || 0);

        if (salary <= 0) {
            return {
                dbrRatio: 0,
                maxLimit,
                actualDeductionPct: 0,
                isExceeded: false,
                score: null as number | null,
                scoreLabel: "—",
                colorClass: "bg-gray-300",
                textClass: "text-gray-600",
                barColor: "#E2E8F0",
                status: "empty",
            };
        }

        const actualDeductionPct = Math.round(((carInstallment + obligations) / salary) * 100);
        const isExceeded = actualDeductionPct > maxLimit;

        if (isExceeded) {
            return {
                dbrRatio: actualDeductionPct,
                maxLimit,
                actualDeductionPct,
                isExceeded: true,
                score: 32,
                scoreLabel: "32%",
                colorClass: "bg-[#C81E1E]",
                textClass: "text-[#C81E1E]",
                barColor: "#C81E1E",
                status: "high_dbr",
            };
        }

        if (actualDeductionPct > maxLimit * 0.75) {
            const score = Math.max(45, Math.min(75, 100 - actualDeductionPct));
            return {
                dbrRatio: actualDeductionPct,
                maxLimit,
                actualDeductionPct,
                isExceeded: false,
                score,
                scoreLabel: `${score}%`,
                colorClass: "bg-[#D97706]",
                textClass: "text-[#D97706]",
                barColor: "#D97706",
                status: "medium_dbr",
            };
        }

        const score = Math.max(80, Math.min(95, 100 - actualDeductionPct));
        return {
            dbrRatio: actualDeductionPct,
            maxLimit,
            actualDeductionPct,
            isExceeded: false,
            score,
            scoreLabel: `${score}%`,
            colorClass: "bg-[#16A34A]",
            textClass: "text-[#16A34A]",
            barColor: "#16A34A",
            status: "good_dbr",
        };
    }, [form.salary, form.obligations, form.obligationType, car.min_installment, car.cash_price]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (mode === "cash" && !canSubmitCash) return;
        if (mode === "finance" && !canSubmitFinance) return;

        setSubmitting(true);

        try {
            const obligationTypeLabel =
                form.obligationType === "none"
                    ? "بدون التزام (استقطاع حتى 45%)"
                    : form.obligationType === "personal"
                      ? "التزام شخصي (استقطاع حتى 45%)"
                      : "عقار + شخصي (استقطاع حتى 65%)";

            const notes = [
                mode === "finance" ? "طلب تمويل سيارة" : "طلب شراء كاش مباشر",
                form.salary ? `الدخل الشهري: ${form.salary} ر.س` : "",
                form.workSector ? `جهة العمل: ${form.workSector}` : "",
                `طبيعة الالتزامات: ${obligationTypeLabel}`,
                form.obligations ? `قيمة الالتزامات: ${form.obligations} ر.س` : "",
                `نسبة الاستقطاع الفعلية: ${dbrAnalysis.actualDeductionPct}% (الحد الأقصى: ${dbrAnalysis.maxLimit}%)`,
                form.consolidateDebts ? "يرغب في الاستفادة من خيار الحلول التمويلية وتوحيد الالتزامات" : "",
            ]
                .filter(Boolean)
                .join(" | ");

            await submitBooking({
                client_name: form.fullName,
                client_phone: form.phone,
                client_email: form.email || undefined,
                city: form.city || "الرياض",
                car_id: car.id,
                down_payment: 0,
                booking_type: mode === "finance" ? "finance" : "purchase",
                notes,
            });

            setDone(true);
        } catch {
            toast.error(t("specialOrder.error.submitFailed", { defaultValue: "فشل إرسال الطلب، يرجى المحاولة مرة أخرى" }));
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
        otpEnabled,
        sendingOtp,
        verifyingOtp,
        otpSent,
        otpVerified,
        form,
        cityOptions,
        setField,
        handleSendOtp,
        handleVerifyOtp,
        canSubmitCash,
        canSubmitFinance,
        dbrAnalysis,
        handleFormSubmit,
    };
}

