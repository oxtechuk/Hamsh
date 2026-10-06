import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getCities } from "../../services/api";
import { useLanguageStore } from "../../store/language.store";
import { sanitizeSaudiPhone, isValidSaudiPhone } from "../../hooks/useCarOrderForm";

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

export default function SpecialOrderStepOne({
    data,
    onChange,
    onNext,
    hideEmail,
}: ISpecialOrderStepOneProps) {
    const { t } = useTranslation();
    const [attempted, setAttempted] = useState(false);

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

    const isNameValid = Boolean(data.fullName.trim());
    const isPhoneValid = isValidSaudiPhone(data.phone);
    const isCityValid = Boolean(data.city.trim());
    const isSalaryValid = Boolean(data.salary.trim());
    const isObligationsValid = Boolean(data.obligations.trim());
    const isEmailValid = hideEmail || Boolean(data.email.trim());

    const canContinue =
        isNameValid &&
        isPhoneValid &&
        isCityValid &&
        isSalaryValid &&
        isObligationsValid &&
        isEmailValid;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAttempted(true);

        if (!isNameValid) {
            toast.error(
                t("specialOrder.validation.fullName", {
                    defaultValue: "يرجى إدخال الاسم الكامل",
                })
            );
            return;
        }

        if (!data.phone.trim()) {
            toast.error(
                t("specialOrder.validation.phone", {
                    defaultValue: "يرجى إدخال رقم الجوال",
                })
            );
            return;
        }

        if (!isPhoneValid) {
            toast.error(
                t("financeCalculator.validation.validPhone", {
                    defaultValue:
                        "يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 (10 أرقام)",
                })
            );
            return;
        }

        if (!isCityValid) {
            toast.error(
                t("specialOrder.validation.city", {
                    defaultValue: "يرجى اختيار المدينة",
                })
            );
            return;
        }

        if (!isSalaryValid) {
            toast.error(
                t("specialOrder.validation.salary", {
                    defaultValue: "يرجى إدخال الراتب الشهري",
                })
            );
            return;
        }

        if (!isObligationsValid) {
            // Auto-fill 0 if empty so the client is not blocked if they have no obligations
            onChange("obligations", "0");
        }

        if (!isEmailValid) {
            toast.error(
                t("specialOrder.validation.email", {
                    defaultValue: "يرجى إدخال البريد الإلكتروني",
                })
            );
            return;
        }

        onNext();
    };

    const getInputCls = (isValid: boolean) =>
        attempted && !isValid
            ? `${fieldCls} border-red-500 ring-1 ring-red-400 bg-red-50/20`
            : fieldCls;

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

            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                <span className="font-bold text-red-500">*</span>
                <span>
                    {t(
                        "specialOrder.requiredNote",
                        "الحقول المؤشر عليها بعلامة (*) إجبارية للمتابعة"
                    )}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-[17px]">
                <FieldGroup
                    label={t("specialOrder.step1.fullName")}
                    required
                    error={
                        attempted && !isNameValid
                            ? t("specialOrder.validation.fullName", {
                                  defaultValue: "يرجى إدخال الاسم الكامل",
                              })
                            : undefined
                    }
                >
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(event) =>
                            onChange("fullName", event.target.value)
                        }
                        placeholder={t("specialOrder.step1.fullNamePlaceholder")}
                        autoComplete="name"
                        className={getInputCls(isNameValid)}
                        required
                    />
                </FieldGroup>

                <FieldGroup
                    label={t("specialOrder.step1.phone")}
                    required
                    error={
                        attempted && !isPhoneValid
                            ? t("financeCalculator.validation.validPhone", {
                                  defaultValue:
                                      "يرجى إدخال رقم جوال سعودي يبدأ بـ 05 (10 أرقام)",
                              })
                            : undefined
                    }
                >
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(event) =>
                            onChange(
                                "phone",
                                sanitizeSaudiPhone(event.target.value)
                            )
                        }
                        placeholder={t(
                            "specialOrder.step1.phonePlaceholder",
                            "05xxxxxxxx"
                        )}
                        maxLength={10}
                        pattern="^05[0-9]{8}$"
                        inputMode="numeric"
                        autoComplete="tel"
                        dir="ltr"
                        className={`${getInputCls(isPhoneValid)} text-end`}
                        required
                    />
                </FieldGroup>

                {!hideEmail && (
                    <FieldGroup
                        label={t("specialOrder.step1.email")}
                        required={!hideEmail}
                        error={
                            attempted && !isEmailValid
                                ? t("specialOrder.validation.email", {
                                      defaultValue: "يرجى إدخال البريد الإلكتروني",
                                  })
                                : undefined
                        }
                    >
                        <input
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                onChange("email", event.target.value)
                            }
                            placeholder={t(
                                "specialOrder.step1.emailPlaceholder"
                            )}
                            dir="ltr"
                            className={`${getInputCls(isEmailValid)} text-end`}
                            required
                        />
                    </FieldGroup>
                )}

                <FieldGroup
                    label={t("specialOrder.step1.city")}
                    required
                    error={
                        attempted && !isCityValid
                            ? t("specialOrder.validation.city", {
                                  defaultValue: "يرجى اختيار المدينة",
                              })
                            : undefined
                    }
                >
                    <select
                        value={data.city}
                        onChange={(event) =>
                            onChange("city", event.target.value)
                        }
                        className={getInputCls(isCityValid)}
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
                    <FieldGroup
                        label={t("specialOrder.step1.salary")}
                        required
                        error={
                            attempted && !isSalaryValid
                                ? t("specialOrder.validation.salary", {
                                      defaultValue: "يرجى إدخال الراتب",
                                  })
                                : undefined
                        }
                    >
                        <input
                            type="number"
                            min={0}
                            value={data.salary}
                            onChange={(event) =>
                                onChange("salary", event.target.value)
                            }
                            placeholder={t(
                                "specialOrder.step1.salaryPlaceholder"
                            )}
                            inputMode="numeric"
                            className={getInputCls(isSalaryValid)}
                            required
                        />
                    </FieldGroup>

                    <FieldGroup
                        label={t("specialOrder.step1.obligations")}
                        required
                        error={
                            attempted && !isObligationsValid
                                ? t("specialOrder.validation.obligations", {
                                      defaultValue:
                                          "يرجى إدخال الالتزامات (أو 0)",
                                  })
                                : undefined
                        }
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
                                "أدخل 0 إذا لا يوجد"
                            )}
                            inputMode="numeric"
                            className={getInputCls(isObligationsValid)}
                            required
                        />
                    </FieldGroup>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className={[
                            "flex h-[52px] w-full",
                            "items-center justify-center",
                            "bg-[var(--brand-primary-color)]",
                            "px-6",
                            "text-[13px] font-bold!",
                            "text-[#20283A]",
                            "transition duration-300",
                            "hover:brightness-95",
                            "active:scale-[0.99]",
                            !canContinue ? "opacity-80" : "",
                        ].join(" ")}
                    >
                        {t("specialOrder.step1.nextButton")}
                    </button>

                    {!canContinue && attempted && (
                        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-800 animate-fadeIn">
                            <span>⚠️</span>
                            <span>
                                {t(
                                    "specialOrder.step1.fillRequiredHint",
                                    "يرجى تعبئة جميع الحقول الإجبارية المؤشر عليها بـ (*) للمتابعة"
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}

function FieldGroup({ label, required = false, error, children }: IFieldGroupProps) {
    return (
        <div className="w-full">
            <label className="mb-2 block text-start text-[12px] font-bold text-[#303A54]">
                {label}
                {required && (
                    <span
                        className="text-red-500 font-bold ms-1"
                        title="حقل إجباري"
                        aria-hidden="true"
                    >
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <p className="mt-1 text-start text-[11px] font-medium text-red-500 animate-fadeIn">
                    {error}
                </p>
            )}
        </div>
    );
}
