import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { getCities } from "../../services/api";
import { useLanguageStore } from "../../store/language.store";

import type { IDriveStepOneProps } from "../../interfaces/IDriveStepOneProps";
import type { IFieldGroupProps } from "../../interfaces/IFieldGroupProps";

const STATIC_CITIES = [
    "الرياض",
    "جدة",
    "مكة المكرمة",
    "المدينة المنورة",
    "الدمام",
];

const fieldCls = [
    "h-[50px] w-full",
    "border-0 bg-white px-4",
    "text-[12px] text-[#303A54]",
    "outline-none",
    "shadow-[0_6px_18px_rgba(48,58,84,0.06)]",
    "placeholder:text-[#A8ABB2]",
    "transition duration-300",
    "focus:ring-1 focus:ring-[var(--brand-primary-color)]",
].join(" ");

export default function DriveStepOne({
    data,
    onChange,
    onNext,
}: IDriveStepOneProps) {
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
        data.obligations.trim();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canContinue) return;

        onNext();
    };

    return (
        <section dir={direction} className="w-full">
            <h2 className="text-start text-[27px] font-extrabold text-[#20283A] sm:text-[30px]">
                {t("drivePage.step1.title")}
            </h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-[17px]">
                <FieldGroup label={t("drivePage.step1.fullName")}>
                    <input
                        value={data.fullName}
                        onChange={(event) =>
                            onChange("fullName", event.target.value)
                        }
                        placeholder={t("drivePage.step1.fullNamePlaceholder")}
                        className={fieldCls}
                    />
                </FieldGroup>

                <FieldGroup label={t("drivePage.step1.phone")}>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(event) =>
                            onChange("phone", event.target.value)
                        }
                        placeholder={t("drivePage.step1.phonePlaceholder")}
                        dir="ltr"
                        className={`${fieldCls} text-end`}
                    />
                </FieldGroup>

                <FieldGroup label={t("drivePage.step1.city")}>
                    <select
                        value={data.city}
                        onChange={(event) =>
                            onChange("city", event.target.value)
                        }
                        className={fieldCls}
                    >
                        <option value="" disabled>
                            {t("drivePage.step1.cityPlaceholder")}
                        </option>
                        {cityOptions.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label={t("drivePage.step1.salary")}>
                        <input
                            type="number"
                            value={data.salary}
                            onChange={(event) =>
                                onChange("salary", event.target.value)
                            }
                            placeholder={t(
                                "drivePage.step1.salaryPlaceholder",
                            )}
                            className={fieldCls}
                        />
                    </FieldGroup>

                    <FieldGroup label={t("drivePage.step1.obligations")}>
                        <input
                            type="number"
                            value={data.obligations}
                            onChange={(event) =>
                                onChange("obligations", event.target.value)
                            }
                            placeholder={t(
                                "drivePage.step1.obligationsPlaceholder",
                            )}
                            className={fieldCls}
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
                        "text-[13px] font-bold! text-[#20283A]",
                        "transition duration-300",
                        "hover:brightness-95",
                        "disabled:opacity-40",
                    ].join(" ")}
                >
                    {t("drivePage.step1.nextButton")}
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
