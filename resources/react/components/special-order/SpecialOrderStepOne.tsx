import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { getCities } from "../../services/api";
import { useLanguageStore } from "../../store/language.store";

import type { ISpecialOrderStepOneProps } from "../../interfaces/ISpecialOrderStepOneProps";

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
    "h-[50px] w-full",
    "border-0",
    "bg-white px-4",
    "text-[12px] text-[#303A54]",
    "outline-none",
    "shadow-[0_6px_18px_rgba(48,58,84,0.06)]",
    "placeholder:text-[#A8ABB2]",
    "transition duration-300",
    "focus:ring-1",
    "focus:ring-[var(--brand-primary-color)]",
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
            {/* Title */}
            <h2
                className={[
                    "text-start",
                    "text-[27px] font-extrabold",
                    "leading-[1.25]",
                    "text-[#20283A]",
                    "sm:text-[30px]",
                ].join(" ")}
            >
                {t("specialOrder.step1.title", "بياناتك الشخصية")}
            </h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-[17px]">
                {/* Full name */}
                <FieldGroup
                    label={t("specialOrder.step1.fullName", "الاسم الكامل")}
                >
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(event) =>
                            onChange("fullName", event.target.value)
                        }
                        placeholder={t(
                            "specialOrder.step1.fullNamePlaceholder",
                            "اسمك",
                        )}
                        autoComplete="name"
                        className={fieldCls}
                        required
                    />
                </FieldGroup>

                {/* Phone */}
                <FieldGroup label={t("specialOrder.step1.phone", "رقم الجوال")}>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(event) =>
                            onChange("phone", event.target.value)
                        }
                        placeholder={t(
                            "specialOrder.step1.phonePlaceholder",
                            "05XXXXXXXX",
                        )}
                        inputMode="tel"
                        autoComplete="tel"
                        dir="ltr"
                        className={`${fieldCls} text-end`}
                        required
                    />
                </FieldGroup>

                {/* Optional Email */}
                {!hideEmail && (
                    <FieldGroup
                        label={t(
                            "specialOrder.step1.email",
                            "البريد الإلكتروني",
                        )}
                    >
                        <input
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                onChange("email", event.target.value)
                            }
                            placeholder="name@example.com"
                            dir="ltr"
                            className={`${fieldCls} text-end`}
                            required
                        />
                    </FieldGroup>
                )}

                {/* City */}
                <FieldGroup label={t("specialOrder.step1.city", "المدينة")}>
                    <input
                        list="special-order-cities"
                        value={data.city}
                        onChange={(event) =>
                            onChange("city", event.target.value)
                        }
                        placeholder={t(
                            "specialOrder.step1.cityPlaceholder",
                            "مثال: الرياض",
                        )}
                        className={fieldCls}
                        required
                    />

                    <datalist id="special-order-cities">
                        {cityOptions.map((city) => (
                            <option key={city} value={city} />
                        ))}
                    </datalist>
                </FieldGroup>

                {/* Salary + Obligations */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Salary */}
                    <FieldGroup
                        label={t("specialOrder.step1.salary", "الراتب")}
                    >
                        <input
                            type="number"
                            min={0}
                            value={data.salary}
                            onChange={(event) =>
                                onChange("salary", event.target.value)
                            }
                            placeholder={t(
                                "specialOrder.step1.salaryPlaceholder",
                                "مثال: 2000 ر.س",
                            )}
                            inputMode="numeric"
                            className={fieldCls}
                            required
                        />
                    </FieldGroup>

                    {/* Obligations */}
                    <FieldGroup
                        label={t(
                            "specialOrder.step1.obligations",
                            "الالتزامات",
                        )}
                    >
                        <input
                            type="number"
                            min={0}
                            value={data.obligations}
                            onChange={(event) =>
                                onChange("obligations", event.target.value)
                            }
                            placeholder={t(
                                "specialOrder.step1.obligationsPlaceholder",
                                "مثال: 800 ر.س",
                            )}
                            inputMode="numeric"
                            className={fieldCls}
                            required
                        />
                    </FieldGroup>
                </div>

                {/* Next */}
                <button
                    type="submit"
                    disabled={!canContinue}
                    className={[
                        "mt-7 flex h-[52px] w-full",
                        "items-center justify-center",
                        "bg-[var(--brand-primary-color)]",
                        "px-6",
                        "text-[13px] font-bold",
                        "text-[#20283A]",
                        "transition duration-300",
                        "hover:brightness-95",
                        "disabled:cursor-not-allowed",
                        "disabled:opacity-40",
                    ].join(" ")}
                >
                    {t("specialOrder.step1.nextButton", "التالي ←")}
                </button>
            </form>
        </section>
    );
}

interface FieldGroupProps {
    label: string;
    children: React.ReactNode;
}

function FieldGroup({ label, children }: FieldGroupProps) {
    return (
        <div className="w-full">
            <label
                className={[
                    "mb-[7px] block",
                    "text-start",
                    "text-[10px] font-medium",
                    "text-[#303A54]",
                ].join(" ")}
            >
                {label}
            </label>

            {children}
        </div>
    );
}
