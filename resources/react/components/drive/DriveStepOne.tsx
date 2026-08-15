import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { getCities } from "../../services/api";
import type { IDrivePersonalInfo } from "../../pages/DrivePage";

interface DriveStepOneProps {
    data: IDrivePersonalInfo;
    onChange: (key: keyof IDrivePersonalInfo, value: string) => void;
    onNext: () => void;
}

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
}: DriveStepOneProps) {
    const { t } = useTranslation();

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
        <section className="w-full">
            <h2 className="text-start text-[27px] font-extrabold text-[#20283A] sm:text-[30px]">
                {t("drivePage.step1.title", "بياناتك الشخصية")}
            </h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-[17px]">
                <FieldGroup label="الاسم الكامل">
                    <input
                        value={data.fullName}
                        onChange={(event) =>
                            onChange("fullName", event.target.value)
                        }
                        placeholder="اسمك"
                        className={fieldCls}
                    />
                </FieldGroup>

                <FieldGroup label="رقم الجوال">
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(event) =>
                            onChange("phone", event.target.value)
                        }
                        placeholder="05XXXXXXXX"
                        dir="ltr"
                        className={`${fieldCls} text-end`}
                    />
                </FieldGroup>

                <FieldGroup label="المدينة">
                    <input
                        list="drive-cities"
                        value={data.city}
                        onChange={(event) =>
                            onChange("city", event.target.value)
                        }
                        placeholder="مثال: الرياض"
                        className={fieldCls}
                    />

                    <datalist id="drive-cities">
                        {cityOptions.map((city) => (
                            <option key={city} value={city} />
                        ))}
                    </datalist>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="الراتب">
                        <input
                            type="number"
                            value={data.salary}
                            onChange={(event) =>
                                onChange("salary", event.target.value)
                            }
                            placeholder="مثال: 2000 ر.س"
                            className={fieldCls}
                        />
                    </FieldGroup>

                    <FieldGroup label="الالتزامات">
                        <input
                            type="number"
                            value={data.obligations}
                            onChange={(event) =>
                                onChange("obligations", event.target.value)
                            }
                            placeholder="مثال: 800 ر.س"
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
                        "text-[13px] font-bold text-[#20283A]",
                        "transition duration-300",
                        "hover:brightness-95",
                        "disabled:opacity-40",
                    ].join(" ")}
                >
                    {t("drivePage.step1.next", "التالي ←")}
                </button>
            </form>
        </section>
    );
}

function FieldGroup({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-[7px] block text-start text-[10px] font-medium text-[#303A54]">
                {label}
            </label>

            {children}
        </div>
    );
}
