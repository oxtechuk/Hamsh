import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../../store/language.store";
import { getSpecialOrderOptions } from "../../services/api";
import type { ISpecialOrderStepTwoProps } from "../../interfaces/ISpecialOrderStepTwoProps";

const fieldCls = [
    "h-[52px] w-full",
    "border-0",
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
    const direction = useLanguageStore((state) => state.direction);

    const { data: options } = useQuery({
        queryKey: ["special-order-options"],
        queryFn: getSpecialOrderOptions,
        staleTime: 10 * 60 * 1000,
    });

    const brandOptions = options?.brands ?? [];
    const modelOptions = options?.models ?? [];
    const yearOptions = options?.years ?? [];
    const colorOptions = options?.colors ?? [];

    const canContinue =
        data.brand.trim() &&
        data.model.trim() &&
        data.color.trim() &&
        data.year.trim();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canContinue) {
            return;
        }

        onNext();
    };

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

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.brand")}
                    </label>

                    <select
                        value={data.brand}
                        onChange={(event) =>
                            onChange("brand", event.target.value)
                        }
                        className={fieldCls}
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
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.model")}
                    </label>

                    <select
                        value={data.model}
                        onChange={(event) =>
                            onChange("model", event.target.value)
                        }
                        className={fieldCls}
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
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.color")}
                    </label>

                    <select
                        value={data.color}
                        onChange={(event) =>
                            onChange("color", event.target.value)
                        }
                        className={fieldCls}
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
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.year")}
                    </label>

                    <select
                        value={data.year}
                        onChange={(event) =>
                            onChange("year", event.target.value)
                        }
                        className={fieldCls}
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
                </div>

                <div>
                    <label className={labelCls}>
                        {t("specialOrder.step2.notes")}
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

                <div className="flex items-center gap-3 pt-3">
                    <button
                        type="submit"
                        disabled={!canContinue}
                        className={[
                            "flex h-[52px] flex-[2.2]",
                            "items-center justify-center",
                            "bg-[var(--brand-primary-color)]",
                            "px-6",
                            "text-[14px] font-bold! text-[#20283A]",
                            "transition duration-300",
                            "hover:brightness-95",
                            "disabled:cursor-not-allowed",
                            "disabled:opacity-40",
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
            </form>
        </section>
    );
}
