import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2 } from "lucide-react";

import {
    CAR_ORDER_WORK_SECTORS_LIST,
    carOrderFieldCls,
    carOrderLabelCls,
} from "../../constants/car-order.constants";

import type { ICarOrderFormData } from "../../interfaces/ICarOrderModalProps";

interface CarOrderFinanceFormProps {
    form: ICarOrderFormData;
    cityOptions: string[];
    dbrAnalysis: {
        dbrRatio: number;
        isExceeded: boolean;
        score: number | null;
        scoreLabel: string;
        colorClass: string;
        textClass: string;
        barColor: string;
        status: string;
    };
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
    canSubmit,
    submitting,
    onFieldChange,
    onSubmit,
}: CarOrderFinanceFormProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-start">
            {/* 1. الاسم الكريم */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "الاسم الكريم" : "Full Name"}
                </label>
                <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => onFieldChange("fullName", e.target.value)}
                    placeholder={isRTL ? "اسمك الكريم" : "Your Name"}
                    className={carOrderFieldCls}
                    required
                />
            </div>

            {/* 2. رقم الجوال */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "رقم الجوال" : "Mobile Number"}
                </label>
                <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => onFieldChange("phone", e.target.value)}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className={`${carOrderFieldCls} text-start`}
                    required
                />
            </div>

            {/* 3. المدينة */}
            <div>
                <label className={carOrderLabelCls}>
                    {isRTL ? "المدينة" : "City"}
                </label>
                <select
                    value={form.city}
                    onChange={(e) => onFieldChange("city", e.target.value)}
                    className={`${carOrderFieldCls} cursor-pointer`}
                    required
                >
                    <option value="" disabled>
                        {isRTL ? "اختر المدينة" : "Select City"}
                    </option>
                    {cityOptions.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            {/* 4. جهة العمل */}
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
                    {CAR_ORDER_WORK_SECTORS_LIST.map((sector) => (
                        <option key={sector.value} value={sector.value}>
                            {isRTL ? sector.labelAr : sector.labelEn}
                        </option>
                    ))}
                </select>
            </div>

            {/* 5. الدخل الشهري و الالتزامات الشهرية الحالية */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={carOrderLabelCls}>
                        {isRTL ? "الدخل الشهري (ر.س)" : "Monthly Salary (SAR)"}
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.salary}
                        onChange={(e) => onFieldChange("salary", e.target.value)}
                        placeholder="5000"
                        className={carOrderFieldCls}
                        required
                    />
                </div>

                <div>
                    <label className={carOrderLabelCls}>
                        {isRTL ? "الالتزامات الشهرية الحالية" : "Current Obligations"}
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.obligations}
                        onChange={(e) => onFieldChange("obligations", e.target.value)}
                        placeholder="800"
                        className={carOrderFieldCls}
                    />
                </div>
            </div>

            {/* 6. مؤشر إمكانية القبول التفاعلي Dynamic DBR Indicator */}
            <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold text-[#1E293B]">
                        {isRTL ? "مؤشر إمكانية القبول:" : "Acceptance Indicator:"}
                    </span>
                    <span className={`text-[15px] font-black ${dbrAnalysis.textClass}`}>
                        {dbrAnalysis.scoreLabel}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                            width: `${dbrAnalysis.score || 0}%`,
                            backgroundColor: dbrAnalysis.barColor,
                        }}
                    />
                </div>

                {/* Exceeded Warning Box */}
                {dbrAnalysis.isExceeded && (
                    <div className="mt-3 flex flex-col gap-2.5 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#C81E1E]">
                            <span>{isRTL ? "تجاوز الحد المباشر للمصرفية" : "Exceeds direct banking limit"}</span>
                            <span>{isRTL ? `نسبة الاستقطاع: ${dbrAnalysis.dbrRatio}%` : `Deduction: ${dbrAnalysis.dbrRatio}%`}</span>
                        </div>

                        <div className="rounded-xl border border-red-200 bg-red-50/70 p-3 text-start">
                            <div className="flex items-center gap-2 text-[12px] font-bold text-[#C81E1E]">
                                <AlertTriangle size={16} className="shrink-0 text-[#C81E1E]" />
                                <span>{isRTL ? "الالتزامات تتجاوز الحد المباشر للمصرفية." : "Obligations exceed direct banking limit."}</span>
                            </div>

                            <label className="mt-2.5 flex items-center gap-2 text-[12px] font-medium text-gray-800 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={form.consolidateDebts || false}
                                    onChange={(e) => onFieldChange("consolidateDebts", e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#C81E1E] focus:ring-[#C81E1E]"
                                />
                                <span>{isRTL ? 'أرغب في الاستفادة من "خيار الحلول التمويلية وتوحيد الالتزامات"' : 'I want to benefit from "debt consolidation and finance solutions"'}</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* 7. زر تأكيد التقديم وحساب الإمكانية */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className={[
                        "flex h-[48px] w-full items-center justify-center gap-2",
                        "bg-[#C81E1E] text-white text-[15px] font-bold rounded-lg shadow-md",
                        "transition duration-200 hover:bg-[#A81818] active:scale-[0.99] cursor-pointer",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                    ].join(" ")}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>{isRTL ? "جاري التقديم..." : "Submitting..."}</span>
                        </>
                    ) : (
                        <span>{isRTL ? "تأكيد التقديم وحساب الإمكانية" : "Confirm Application & Check Eligibility"}</span>
                    )}
                </button>
            </div>
        </form>
    );
}
