import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useLanguageStore } from "../../store/language.store";
import { getSpecialOrderOptions } from "../../services/api";
import type { ISpecialOrderStepTwoProps } from "../../interfaces/ISpecialOrderStepTwoProps";

const fieldCls = [
    "h-[52px] w-full",
    "border",
    "border-transparent",
    "bg-white px-4 font-semibold!",
    "text-[13px] text-[#303A54]",
    "outline-none",
    "shadow-[0_7px_18px_rgba(48,58,84,0.06)]",
    "placeholder:text-[#A5A8B0]",
    "transition duration-300",
    "focus:ring-1 focus:ring-[var(--brand-primary-color)]",
].join(" ");

const labelCls = "mb-2 block text-start text-[12px] font-bold text-[#303A54]";

export default function SpecialOrderStepTwo({
    data,
    onChange,
    onNext,
    onBack,
}: ISpecialOrderStepTwoProps) {
    const { t } = useTranslation();
    const [attempted, setAttempted] = useState(false);
    const direction = useLanguageStore((state) => state.direction);

    const { data: options } = useQuery({
        queryKey: ["special-order-options"],
        queryFn: getSpecialOrderOptions,
        staleTime: 10 * 60 * 1000,
    });

    const brandOptions = options?.brands ?? [];
    const rawModelOptions = options?.models ?? [];
    const yearOptions = options?.years ?? [];
    const colorOptions = options?.colors ?? [];

    const selectedBrand = brandOptions.find(
        (b) => b.name === data.brand || String(b.id) === data.brand
    );

    const modelOptions = rawModelOptions
        .filter((m: any) => {
            if (typeof m === "string") return true;
            if (!data.brand) return true;
            const mBrandId = String(m.brand_id ?? m.brandId ?? "");
            const mBrandName = m.brand_name ?? "";
            return (selectedBrand && mBrandId === String(selectedBrand.id)) || mBrandName === data.brand;
        })
        .map((m: any) => (typeof m === "string" ? m : (m.name || m.model || "")))
        .filter((val: string, idx: number, arr: string[]) => Boolean(val) && arr.indexOf(val) === idx);

    const isBrandValid = Boolean(data.brand.trim());
    const isModelValid = Boolean(data.model.trim());
    const isColorValid = Boolean(data.color.trim());
    const isYearValid = Boolean(data.year.trim());

    const canContinue =
        isBrandValid &&
        isModelValid &&
        isColorValid &&
        isYearValid;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAttempted(true);

        if (!isBrandValid) {
            toast.error(
                t("specialOrder.step2.validation.brand", {
                    defaultValue: "يرجى اختيار الماركة",
                })
            );
            return;
        }

        if (!isModelValid) {
            toast.error(
                t("specialOrder.step2.validation.model", {
                    defaultValue: "يرجى اختيار الموديل",
                })
            );
            return;
        }

        if (!isColorValid) {
            toast.error(
                t("specialOrder.step2.validation.color", {
                    defaultValue: "يرجى اختيار اللون المفضل",
                })
            );
            return;
        }

        if (!isYearValid) {
            toast.error(
                t("specialOrder.step2.validation.year", {
                    defaultValue: "يرجى اختيار سنة الصنع",
                })
            );
            return;
        }

        onNext();
    };

    const getSelectCls = (isValid: boolean) =>
        attempted && !isValid
            ? `${fieldCls} border-red-500 ring-1 ring-red-400 bg-red-50/20`
            : fieldCls;

    return (
        <section dir={direction} className="w-full">
            <h2
                className={[
                    "text-start",
                    "text-[26px] font-extrabold",
                    "leading-tight text-[#20283A]",
                    "sm:text-[30px]",
                ].join(" ")}
            >
                {t("specialOrder.step2.title")}
            </h2>

            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                <span className="font-bold text-red-500">*</span>
                <span>
                    {t(
                        "specialOrder.step2.requiredNote",
                        "يرجى تحديد الماركة والموديل واللون وسنة الصنع (*) للمتابعة"
                    )}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.brand")}
                        <span
                            className="text-red-500 font-bold ms-1"
                            title="حقل إجباري"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </label>

                    <select
                        value={data.brand}
                        onChange={(event) => {
                            const newBrand = event.target.value;
                            onChange("brand", newBrand);
                            const newBrandObj = brandOptions.find(
                                (b) => b.name === newBrand || String(b.id) === newBrand
                            );
                            const isValid = (rawModelOptions as any[]).some((m) => {
                                if (typeof m === "string") return true;
                                const mBrandId = String(m.brand_id ?? m.brandId ?? "");
                                const mBrandName = m.brand_name ?? "";
                                const mName = m.name || m.model;
                                return ((newBrandObj && mBrandId === String(newBrandObj.id)) || mBrandName === newBrand) && mName === data.model;
                            });
                            if (!isValid) {
                                onChange("model", "");
                            }
                        }}
                        className={getSelectCls(isBrandValid)}
                        required
                    >
                        <option value="" disabled>
                            {t("specialOrder.step2.brandPlaceholder")}
                        </option>
                        {brandOptions.map((brand) => (
                            <option key={brand.id} value={brand.name}>
                                {brand.name}
                            </option>
                        ))}
                    </select>

                    {attempted && !isBrandValid && (
                        <p className="mt-1 text-start text-[11px] font-medium text-red-500 animate-fadeIn">
                            {t("specialOrder.step2.validation.brand", {
                                defaultValue: "يرجى اختيار الماركة",
                            })}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.model")}
                        <span
                            className="text-red-500 font-bold ms-1"
                            title="حقل إجباري"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </label>

                    <select
                        value={data.model}
                        onChange={(event) =>
                            onChange("model", event.target.value)
                        }
                        className={getSelectCls(isModelValid)}
                        required
                    >
                        <option value="" disabled>
                            {t("specialOrder.step2.modelPlaceholder")}
                        </option>
                        {modelOptions.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>

                    {attempted && !isModelValid && (
                        <p className="mt-1 text-start text-[11px] font-medium text-red-500 animate-fadeIn">
                            {t("specialOrder.step2.validation.model", {
                                defaultValue: "يرجى اختيار الموديل",
                            })}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.color")}
                        <span
                            className="text-red-500 font-bold ms-1"
                            title="حقل إجباري"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </label>

                    <select
                        value={data.color}
                        onChange={(event) =>
                            onChange("color", event.target.value)
                        }
                        className={getSelectCls(isColorValid)}
                        required
                    >
                        <option value="" disabled>
                            {t("specialOrder.step2.colorPlaceholder")}
                        </option>
                        {colorOptions.map((color) => (
                            <option key={color} value={color}>
                                {color}
                            </option>
                        ))}
                    </select>

                    {attempted && !isColorValid && (
                        <p className="mt-1 text-start text-[11px] font-medium text-red-500 animate-fadeIn">
                            {t("specialOrder.step2.validation.color", {
                                defaultValue: "يرجى اختيار اللون المفضل",
                            })}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.year")}
                        <span
                            className="text-red-500 font-bold ms-1"
                            title="حقل إجباري"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </label>

                    <select
                        value={data.year}
                        onChange={(event) =>
                            onChange("year", event.target.value)
                        }
                        className={getSelectCls(isYearValid)}
                        required
                    >
                        <option value="" disabled>
                            {t("specialOrder.step2.yearPlaceholder")}
                        </option>
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    {attempted && !isYearValid && (
                        <p className="mt-1 text-start text-[11px] font-medium text-red-500 animate-fadeIn">
                            {t("specialOrder.step2.validation.year", {
                                defaultValue: "يرجى اختيار سنة الصنع",
                            })}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.notes")}
                        <span className="text-[#8B909A] font-normal text-[11px] ms-1">
                            ({t("common.optional", { defaultValue: "اختياري" })})
                        </span>
                    </label>

                    <textarea
                        value={data.notes}
                        onChange={(event) =>
                            onChange("notes", event.target.value)
                        }
                        placeholder={t("specialOrder.step2.notesPlaceholder")}
                        rows={5}
                        className={[
                            "min-h-[125px] w-full resize-none",
                            "border-0 bg-white px-4 py-4",
                            "text-[13px] text-[#303A54]",
                            "outline-none",
                            "shadow-[0_7px_18px_rgba(48,58,84,0.06)]",
                            "placeholder:text-[#A5A8B0]",
                            "transition duration-300",
                            "focus:ring-1",
                            "focus:ring-[var(--brand-primary-color)]",
                        ].join(" ")}
                    />
                </div>

                <div className="pt-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className={[
                                "flex h-[52px] flex-[2.2]",
                                "items-center justify-center",
                                "bg-[var(--brand-primary-color)]",
                                "px-6",
                                "text-[14px] font-bold! text-[#20283A]",
                                "transition duration-300",
                                "hover:brightness-95",
                                "active:scale-[0.99]",
                                !canContinue ? "opacity-80" : "",
                            ].join(" ")}
                        >
                            {t("specialOrder.step2.nextButton")}
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className={[
                                "flex h-[52px] flex-1",
                                "items-center justify-center",
                                "bg-white",
                                "px-5",
                                "text-[13px] font-bold text-[#303A54]",
                                "shadow-[0_4px_14px_rgba(48,58,84,0.05)]",
                                "transition duration-300",
                                "hover:bg-[#FAFAF8]",
                            ].join(" ")}
                        >
                            {t("specialOrder.step2.backButton")}
                        </button>
                    </div>

                    {!canContinue && attempted && (
                        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-800 animate-fadeIn">
                            <span>⚠️</span>
                            <span>
                                {t(
                                    "specialOrder.step2.fillRequiredHint",
                                    "يرجى تحديد جميع خيارات ومواصفات السيارة المطلوبة (*) للمتابعة"
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}
