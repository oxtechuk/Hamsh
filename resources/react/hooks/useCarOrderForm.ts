import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getCities, submitBooking, getSettings } from "../services/api";
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

// Helper to reliably sanitize and parse numbers from keyboard/paste (Arabic/Eastern numerals, commas, spaces)
export function parseNumericValue(val: unknown): number {
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const str = String(val)
        .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
        .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
        .replace(/,/g, "")
        .replace(/[^\d.]/g, "");
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
}

// Helper to sanitize Saudi phone numbers: digits only, convert Arabic numerals, enforce 05 prefix and max 10 digits
export function sanitizeSaudiPhone(raw: unknown): string {
    if (!raw) return "";
    let cleaned = String(raw)
        .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
        .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
        .replace(/\D/g, "");

    if (cleaned.startsWith("966")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.startsWith("5")) {
        cleaned = "0" + cleaned;
    }

    return cleaned.slice(0, 10);
}

// Strict check for valid 10-digit Saudi mobile number starting with 05
export function isValidSaudiPhone(phone: string): boolean {
    return /^05\d{8}$/.test(phone.trim());
}

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

    const { data: generalSettings } = useQuery({
        queryKey: ["settings"],
        queryFn: () => getSettings(),
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
        setForm((previous) => {
            let nextValue = value;
            if (key === "phone") {
                nextValue = sanitizeSaudiPhone(value) as ICarOrderFormData[K];
            }
            const next = { ...previous, [key]: nextValue };
            if (key === "phone" && previous.otpVerified) {
                next.otpVerified = false;
            }
            if (key === "obligationType" && value === "none") {
                next.obligations = "";
            }
            return next;
        });
    };

    const handleSendOtp = async () => {
        if (!isValidSaudiPhone(form.phone)) {
            toast.error(t("financeCalculator.validation.validPhone", { defaultValue: "يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 (10 أرقام)" }));
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

    // Calculate DBR and Acceptance Score based on dynamic limits from settings
    const dbrAnalysis = useMemo(() => {
        const salary = parseNumericValue(form.salary);

        // Fallback hierarchy: calcSettings -> generalSettings -> default constants
        const initialFinance = (typeof window !== "undefined" && (window as any).__INITIAL_SETTINGS__?.finance_calculator) || {};
        const personalLimit = Number(calcSettings?.dbr_limit_personal ?? generalSettings?.finance_calculator?.dbr_limit_personal ?? initialFinance.dbr_limit_personal ?? 45);
        const realEstateLimit = Number(calcSettings?.dbr_limit_real_estate ?? generalSettings?.finance_calculator?.dbr_limit_real_estate ?? initialFinance.dbr_limit_real_estate ?? 65);
        const debtSolutionText = calcSettings?.debt_solution_text || generalSettings?.finance_calculator?.debt_solution_text || initialFinance.debt_solution_text || "أرغب في الاستفادة من خيارات الحلول التمويلية وتوحيد الالتزامات";
        const exceededWarningText = calcSettings?.exceeded_warning_text || generalSettings?.finance_calculator?.exceeded_warning_text || initialFinance.exceeded_warning_text || "نسبة الاستقطاع تتجاوز الحد المسموح به للتمويل.";

        const maxLimit = form.obligationType === "real_estate_personal" ? realEstateLimit : personalLimit;
        const obligations = form.obligationType === "none" ? 0 : parseNumericValue(form.obligations);

        if (salary <= 0) {
            return {
                dbrRatio: 0,
                maxLimit,
                personalLimit,
                realEstateLimit,
                debtSolutionText,
                exceededWarningText,
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

        const actualDeductionPct = Math.round((obligations / salary) * 100);
        const isExceeded = actualDeductionPct > maxLimit;

        if (isExceeded) {
            return {
                dbrRatio: actualDeductionPct,
                maxLimit,
                personalLimit,
                realEstateLimit,
                debtSolutionText,
                exceededWarningText,
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
                personalLimit,
                realEstateLimit,
                debtSolutionText,
                exceededWarningText,
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
            personalLimit,
            realEstateLimit,
            debtSolutionText,
            exceededWarningText,
            actualDeductionPct,
            isExceeded: false,
            score,
            scoreLabel: `${score}%`,
            colorClass: "bg-[#16A34A]",
            textClass: "text-[#16A34A]",
            barColor: "#16A34A",
            status: "good_dbr",
        };
    }, [form.salary, form.obligations, form.obligationType, calcSettings, generalSettings]);

    const canSubmitCash = Boolean(
        form.fullName.trim() &&
        form.city.trim() &&
        isValidSaudiPhone(form.phone) &&
        (!otpEnabled || otpVerified),
    );

    const canSubmitFinance = Boolean(
        form.fullName.trim() &&
        isValidSaudiPhone(form.phone) &&
        parseNumericValue(form.salary) > 0 &&
        (!otpEnabled || otpVerified) &&
        (!dbrAnalysis.isExceeded || form.consolidateDebts),
    );

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidSaudiPhone(form.phone)) {
            toast.error(t("financeCalculator.validation.validPhone", { defaultValue: "يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 (10 أرقام)" }));
            return;
        }

        if (mode === "cash" && !canSubmitCash) return;
        if (mode === "finance" && !canSubmitFinance) return;

        setSubmitting(true);

        try {
            const obligationTypeLabel =
                form.obligationType === "none"
                    ? `بدون التزام (استقطاع حتى ${dbrAnalysis.personalLimit}%)`
                    : form.obligationType === "personal"
                      ? `التزام شخصي (استقطاع حتى ${dbrAnalysis.personalLimit}%)`
                      : `عقار + شخصي (استقطاع حتى ${dbrAnalysis.realEstateLimit}%)`;

            const notes = [
                mode === "finance" ? "طلب تمويل سيارة" : "طلب شراء كاش مباشر",
                form.salary ? `الدخل الشهري: ${form.salary} ر.س` : "",
                form.workSector ? `جهة العمل: ${form.workSector}` : "",
                `طبيعة الالتزامات: ${obligationTypeLabel}`,
                form.obligations ? `قيمة الالتزامات: ${form.obligations} ر.س` : "",
                `نسبة الاستقطاع الفعلية: ${dbrAnalysis.actualDeductionPct}% (الحد الأقصى: ${dbrAnalysis.maxLimit}%)`,
                form.consolidateDebts ? `يرغب في الاستفادة من خيار: ${dbrAnalysis.debtSolutionText}` : "",
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

