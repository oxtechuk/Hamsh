import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2, User, Home, CheckCircle2, ShieldCheck } from "lucide-react";

import {
    CAR_ORDER_WORK_SECTORS_LIST,
    carOrderFieldCls,
    carOrderLabelCls,
} from "../../constants/car-order.constants";

import type { ICarOrderFormData, ObligationType } from "../../interfaces/ICarOrderModalProps";

interface CarOrderFinanceFormProps {
    form: ICarOrderFormData;
    cityOptions: string[];
    dbrAnalysis: {
        dbrRatio: number;
        maxLimit: number;
        actualDeductionPct: number;
        isExceeded: boolean;
        score: number | null;
        scoreLabel: string;
        colorClass: string;
        textClass: string;
        barColor: string;
        status: string;
    };
    otpEnabled?: boolean;
    sendingOtp?: boolean;
    verifyingOtp?: boolean;
    otpSent?: boolean;
    otpVerified?: boolean;
    onSendOtp?: () => void;
    onVerifyOtp?: () => void;
    canSubmit: boolean;
    submitting: boolean;
    onFieldChange: <K extends keyof ICarOrderFormData>(
        key: K,
        value: ICarOrderFormData[K],
    ) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function CarOrderFinanceForm({
    form,
    cityOptions,
    dbrAnalysis,
    otpEnabled,
    sendingOtp,
    verifyingOtp,
    otpSent,
    otpVerified,
    onSendOtp,
    onVerifyOtp,
    canSubmit,
    submitting,
    onFieldChange,
    onSubmit,
}: CarOrderFinanceFormProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const obligationOptions: {
        type: ObligationType;
        title: string;
        subtext: string;
        icon: React.ReactNode;
    }[] = [
        {
            type: "none",
            title: isRTL ? "بدون التزام" : "No Obligations",
            subtext: isRTL ? "استقطاع حتى 45%" : "Up to 45%",
            icon: (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-sm" />
                </div>
            ),
        },
        {
            type: "personal",
            title: isRTL ? "التزام شخصي" : "Personal Obligation",
            subtext: isRTL ? "استقطاع حتى 45%" : "Up to 45%",
            icon: (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <User size={18} />
                </div>
            ),
        },
        {
            type: "real_estate_personal",
            title: isRTL ? "عقار + شخصي" : "Real Estate + Personal",
            subtext: isRTL ? "استقطاع حتى 65%" : "Up to 65%",
            icon: (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Home size={18} />
                </div>
            ),
        },
    ];

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3.5 text-start">
            {/* 1. الاسم الكريم */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "الاسم الكريم" : "Full Name"}
                </label>
                <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => onFieldChange("fullName", e.target.value)}
                    placeholder={isRTL ? "ادخل اسمك الكامل" : "Enter your full name"}
                    className={carOrderFieldCls}
                    required
                />
            </div>

            {/* 2. رقم الجوال مع زر إرسال الرمز */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "رقم الجوال" : "Mobile Number"}
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                            onFieldChange("phone", e.target.value);
                            if (otpVerified) {
                                onFieldChange("otpVerified", false);
                            }
                        }}
                        placeholder="05xxxxxxxx"
                        dir="ltr"
                        className={`${carOrderFieldCls} flex-1 text-start`}
                        required
                    />

                    {otpEnabled && (
                        <button
                            type="button"
                            onClick={onSendOtp}
                            disabled={sendingOtp || otpVerified || !form.phone.trim()}
                            className={[
                                "shrink-0 flex h-[46px] items-center justify-center px-4 rounded-lg text-[13px] font-bold transition shadow-xs cursor-pointer",
                                otpVerified
                                    ? "bg-emerald-600 text-white cursor-default"
                                    : "bg-[#2E384D] text-white hover:bg-[#1E2638] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                            ].join(" ")}
                        >
                            {sendingOtp ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : otpVerified ? (
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={16} />
                                    <span>{isRTL ? "تم التحقق" : "Verified"}</span>
                                </span>
                            ) : (
                                <span>{isRTL ? "إرسال الرمز" : "Send OTP"}</span>
                            )}
                        </button>
                    )}
                </div>

                {/* OTP Verification Input if code is sent and not yet verified */}
                {otpEnabled && otpSent && !otpVerified && (
                    <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-lg border border-amber-200 bg-amber-50/70 animate-in fade-in">
                        <input
                            type="text"
                            maxLength={6}
                            value={form.otpCode || ""}
                            onChange={(e) => onFieldChange("otpCode", e.target.value)}
                            placeholder={isRTL ? "أدخل رمز التحقق المرسل" : "Enter OTP Code"}
                            dir="ltr"
                            className="h-[38px] flex-1 rounded-md border border-gray-300 bg-white px-3 text-center text-sm font-bold tracking-widest outline-none focus:border-amber-500"
                        />
                        <button
                            type="button"
                            onClick={onVerifyOtp}
                            disabled={verifyingOtp || !form.otpCode?.trim()}
                            className="flex h-[38px] items-center justify-center rounded-md bg-amber-600 px-4 text-xs font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
                        >
                            {verifyingOtp ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <span>{isRTL ? "تحقق" : "Verify"}</span>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* 3. جهة العمل */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "جهة العمل" : "Work Sector"}
                </label>
                <select
                    value={form.workSector}
                    onChange={(e) => onFieldChange("workSector", e.target.value)}
                    className={`${carOrderFieldCls} cursor-pointer`}
                    required
                >
                    <option value="" disabled>
                        {isRTL ? "اختر جهة العمل..." : "Select work sector..."}
                    </option>
                    {CAR_ORDER_WORK_SECTORS_LIST.map((sector) => (
                        <option key={sector.value} value={sector.value}>
                            {isRTL ? sector.labelAr : sector.labelEn}
                        </option>
                    ))}
                </select>
            </div>

            {/* 4. حدد طبيعة التزاماتك المالية الحالية */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "حدد طبيعة التزاماتك المالية الحالية:" : "Select your current financial obligations:"}
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {obligationOptions.map((opt) => {
                        const isSelected = (form.obligationType || "none") === opt.type;
                        return (
                            <button
                                key={opt.type}
                                type="button"
                                onClick={() => onFieldChange("obligationType", opt.type)}
                                className={[
                                    "flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl transition text-center cursor-pointer select-none",
                                    isSelected
                                        ? "border-2 border-[#FF4D5A] bg-white shadow-xs"
                                        : "border border-gray-200 bg-[#FAFAFA] hover:bg-gray-100/80",
                                ].join(" ")}
                            >
                                <div className="mb-1.5">{opt.icon}</div>
                                <p className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] leading-tight">
                                    {opt.title}
                                </p>
                                <p className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-gray-500">
                                    {opt.subtext}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Optional obligations amount input if personal or real estate is selected */}
            {form.obligationType && form.obligationType !== "none" && (
                <div className="animate-in fade-in">
                    <label className={carOrderLabelCls}>
                        {isRTL ? "قيمة الالتزام الشهري الحالي (ر.س)" : "Current Monthly Obligation (SAR)"}
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.obligations}
                        onChange={(e) => onFieldChange("obligations", e.target.value)}
                        placeholder={isRTL ? "مثال 1500" : "e.g. 1500"}
                        className={carOrderFieldCls}
                    />
                </div>
            )}

            {/* 5. الراتب الشهري */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "الراتب الشهري (ر.س)" : "Monthly Salary (SAR)"}
                </label>
                <input
                    type="number"
                    min={0}
                    value={form.salary}
                    onChange={(e) => onFieldChange("salary", e.target.value)}
                    placeholder={isRTL ? "مثال 8000" : "e.g. 8000"}
                    className={carOrderFieldCls}
                    required
                />
            </div>

            {/* 6. نسبة الاستقطاع الفعلية من الراتب والمؤشر الملون */}
            <div className="flex flex-col gap-1.5 pt-1 pb-1 text-start">
                <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1E293B]">
                        {isRTL ? "نسبة الاستقطاع الفعلية من الراتب:" : "Actual Deduction Rate:"}
                    </span>
                    <div className="flex items-center gap-2">
                        {/* Status Label Badge */}
                        {dbrAnalysis.actualDeductionPct > 0 && (
                            <span
                                className={[
                                    "px-2 py-0.5 rounded-md text-[11px] font-bold border",
                                    dbrAnalysis.isExceeded
                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                        : dbrAnalysis.actualDeductionPct > 33
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-200",
                                ].join(" ")}
                            >
                                {dbrAnalysis.isExceeded
                                    ? isRTL ? "مرتفع" : "High"
                                    : dbrAnalysis.actualDeductionPct > 33
                                      ? isRTL ? "متوسط" : "Moderate"
                                      : isRTL ? "ممتاز" : "Excellent"}
                            </span>
                        )}
                        <span
                            className={[
                                "text-[16px] font-black",
                                dbrAnalysis.isExceeded
                                    ? "text-[#C81E1E]"
                                    : dbrAnalysis.actualDeductionPct > 33
                                      ? "text-amber-600"
                                      : dbrAnalysis.actualDeductionPct > 0
                                        ? "text-emerald-600"
                                        : "text-gray-700",
                            ].join(" ")}
                        >
                            {dbrAnalysis.actualDeductionPct}%
                        </span>
                    </div>
                </div>

                {/* Colored Dynamic Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 border border-gray-200/60">
                    <div
                        className={[
                            "h-full rounded-full transition-all duration-500",
                            dbrAnalysis.isExceeded
                                ? "bg-rose-500"
                                : dbrAnalysis.actualDeductionPct > 33
                                  ? "bg-amber-500"
                                  : dbrAnalysis.actualDeductionPct > 0
                                    ? "bg-emerald-500"
                                    : "bg-emerald-400/50",
                        ].join(" ")}
                        style={{
                            width: `${Math.min(100, Math.max(0, dbrAnalysis.actualDeductionPct))}%`,
                        }}
                    />
                </div>
            </div>

            {/* Exceeded Notice */}
            {dbrAnalysis.isExceeded && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-start text-[12px] text-[#C81E1E] font-semibold animate-in fade-in">
                    {isRTL
                        ? `النسبة تتجاوز الحد الأقصى المسموح به (${dbrAnalysis.maxLimit}%) لهذه الفئة.`
                        : `Deduction exceeds the maximum allowable limit (${dbrAnalysis.maxLimit}%).`}
                </div>
            )}


            {/* 7. زر اعتماد والانتقال للتمويل */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className={[
                        "flex h-[48px] w-full items-center justify-center gap-2",
                        "bg-[#FF4D5A] text-white text-[15px] font-bold rounded-lg shadow-sm",
                        "transition duration-200 hover:bg-[#e03e4b] active:scale-[0.99] cursor-pointer",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                    ].join(" ")}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>{isRTL ? "جاري الإرسال..." : "Submitting..."}</span>
                        </>
                    ) : (
                        <span>{isRTL ? "اعتماد والانتقال للتمويل" : "Apply for Finance"}</span>
                    )}
                </button>
            </div>
        </form>
    );
}

