import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { getCities } from "../../services/api";
import { useLanguageStore } from "../../store/language.store";

import type { ISpecialOrderStepOneProps } from "../../interfaces/ISpecialOrderStepOneProps";
import type { IFieldGroupProps } from "../../interfaces/IFieldGroupProps";

const STATIC_CITIES = [
    "الرياض",
    "جدة",
    "مكة المكرمة",
    "المدينة المنورة",
    "الدمام",
    "الخبر",
    "الظهران",
    "الطائف",
    "بريدة",
    "تبوك",
    "أبها",
    "خميس مشيط",
    "حائل",
    "نجران",
    "الجبيل",
    "ينبع",
    "القطيف",
    "الأحساء",
    "عرعر",
    "سكاكا",
    "جازان",
    "الباحة",
];

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

export default function SpecialOrderStepOne({
    data,
    onChange,
    onNext,
    hideEmail,
}: ISpecialOrderStepOneProps) {
    const { t } = useTranslation();

    const direction = useLanguageStore((state) => state.direction);

    const { data: citiesData = [] } = useQuery({
        queryKey: ["cities"],
        queryFn: getCities,
        staleTime: 10 * 60 * 1000,
    });

    const cityOptions =
        citiesData.length > 0
            ? citiesData.map((city) => city.name)
            : STATIC_CITIES;

    const canContinue =
        data.fullName.trim() &&
        data.phone.trim() &&
        data.city.trim() &&
        data.salary.trim() &&
        data.obligations.trim() &&
        (hideEmail || data.email.trim());

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
                    "text-[27px] font-extrabold",
                    "leading-[1.25]",
                    "text-[#20283A]",
                    "sm:text-[30px]",
                ].join(" ")}
            >
                {t("specialOrder.step1.title")}
            </h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-[17px]">
                <FieldGroup label={t("specialOrder.step1.fullName")}>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(event) =>
                            onChange("fullName", event.target.value)
                        }
                        placeholder={t("specialOrder.step1.fullNamePlaceholder")}
                        autoComplete="name"
                        className={fieldCls}
                        required
                    />
                </FieldGroup>

                <FieldGroup label={t("specialOrder.step1.phone")}>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(event) =>
                            onChange("phone", event.target.value)
                        }
                        placeholder={t("specialOrder.step1.phonePlaceholder")}
                        inputMode="tel"
                        autoComplete="tel"
                        dir="ltr"
                        className={`${fieldCls} text-end`}
                        required
                    />
                </FieldGroup>

                {!hideEmail && (
                    <FieldGroup label={t("specialOrder.step1.email")}>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                onChange("email", event.target.value)
                            }
                            placeholder={t("specialOrder.step1.emailPlaceholder")}
                            dir="ltr"
                            className={`${fieldCls} text-end`}
                            required
                        />
                    </FieldGroup>
                )}

                <FieldGroup label={t("specialOrder.step1.city")}>
                    <select
                        value={data.city}
                        onChange={(event) =>
                            onChange("city", event.target.value)
                        }
                        className={fieldCls}
                        required
                    >
                        <option value="" disabled>
                            {t("specialOrder.step1.cityPlaceholder")}
                        </option>
                        {cityOptions.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label={t("specialOrder.step1.salary")}>
                        <input
                            type="number"
                            min={0}
                            value={data.salary}
                            onChange={(event) =>
                                onChange("salary", event.target.value)
                            }
                            placeholder={t(
                                "specialOrder.step1.salaryPlaceholder",
                            )}
                            inputMode="numeric"
                            className={fieldCls}
                            required
                        />
                    </FieldGroup>

                    <FieldGroup label={t("specialOrder.step1.obligations")}>
                        <input
                            type="number"
                            min={0}
                            value={data.obligations}
                            onChange={(event) =>
                                onChange("obligations", event.target.value)
                            }
                            placeholder={t(
                                "specialOrder.step1.obligationsPlaceholder",
                            )}
                            inputMode="numeric"
                            className={fieldCls}
                            required
                        />
                    </FieldGroup>
                </div>

                <button
                    type="submit"
                    disabled={!canContinue}
                    className={[
                        "mt-7 flex h-[52px] w-full",
                        "items-center justify-center",
                        "bg-[var(--brand-primary-color)]",
                        "px-6",
                        "text-[13px] font-bold!",
                        "text-[#20283A]",
                        "transition duration-300",
                        "hover:brightness-95",
                        "disabled:cursor-not-allowed",
                        "disabled:opacity-40",
                    ].join(" ")}
                >
                    {t("specialOrder.step1.nextButton")}
                </button>
            </form>
        </section>
    );
}

function FieldGroup({ label, children }: IFieldGroupProps) {
    return (
        <div className="w-full">
            <label className="mb-2 block text-start text-[12px] font-bold text-[#303A54]">
                {label}
            </label>

            {children}
        </div>
    );
}
