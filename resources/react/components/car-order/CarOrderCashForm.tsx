import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2, CheckCircle2 } from "lucide-react";

import {
    carOrderFieldCls,
    carOrderLabelCls,
} from "../../constants/car-order.constants";

import type { ICarOrderFormData } from "../../interfaces/ICarOrderModalProps";

interface CarOrderCashFormProps {
    form: ICarOrderFormData;
    cityOptions: string[];
    canSubmit: boolean;
    submitting: boolean;
    onFieldChange: <K extends keyof ICarOrderFormData>(
        key: K,
        value: ICarOrderFormData[K],
    ) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function CarOrderCashForm({
    form,
    cityOptions,
    canSubmit,
    submitting,
    onFieldChange,
    onSubmit,
}: CarOrderCashFormProps) {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-start">
            {/* Cash Badge */}
            <div className="flex items-center gap-2 bg-amber-50 text-[#A67C2E] border border-amber-200/60 px-3.5 py-2.5 rounded-lg text-xs font-semibold">
                <CheckCircle2 size={16} className="shrink-0 text-[#DDBB68]" />
                <span>{isRTL ? "طلب شراء نقدي مباشر واستلام سريع للسيارة" : "Direct cash purchase order with fast delivery"}</span>
            </div>

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

            {/* Submit Button */}
            <div className="pt-3">
                <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className={[
                        "flex h-[48px] w-full items-center justify-center gap-2",
                        "bg-[var(--brand-primary-color,#DDBB68)] text-[#151A2A] text-[15px] font-bold rounded-lg shadow-sm",
                        "transition duration-200 hover:bg-[#CBA458] active:scale-[0.99] cursor-pointer",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                    ].join(" ")}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>{isRTL ? "جاري إرسال الطلب..." : "Submitting..."}</span>
                        </>
                    ) : (
                        <span>{isRTL ? "تأكيد طلب الشراء" : "Confirm Purchase Order"}</span>
                    )}
                </button>
            </div>
        </form>
    );
}
