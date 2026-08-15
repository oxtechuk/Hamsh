import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../../store/language.store";
import { getCities } from "../../services/api";

import type { IPersonalInfo } from "../../interfaces/IPersonalInfo";
import type { IStepOneFormProps } from "../../interfaces/IStepOneFormProps";

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

const fieldClassName = [
  "h-[52px] w-full",
  "border-0",
  "bg-white px-4",
  "text-[13px] text-[#303A54]",
  "outline-none",
  "shadow-[0_7px_18px_rgba(48,58,84,0.06)]",
  "placeholder:text-[#A5A8B0]",
  "transition duration-300",
  "focus:ring-1 focus:ring-[var(--brand-primary-color)]",
].join(" ");

export default function StepOneForm({
  onNext,
}: IStepOneFormProps) {
  const { t } = useTranslation();

  const direction = useLanguageStore(
    (state) => state.direction,
  );

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [city, setCity] =
    useState("");

  const [salary, setSalary] =
    useState("");

  const [obligations, setObligations] =
    useState("");

  const { data: citiesData = [] } =
    useQuery({
      queryKey: ["cities"],
      queryFn: getCities,
      staleTime: 10 * 60 * 1000,
    });

  const cityOptions =
    citiesData.length > 0
      ? citiesData.map(
          (cityItem) =>
            cityItem.name,
        )
      : STATIC_CITIES;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !city.trim()
    ) {
      toast.error(
        t(
          "financeCalculator.validation.fillRequired",
        ),
      );

      return;
    }

    onNext({
      fullName:
        fullName.trim(),

      phone:
        phone.trim(),

      email: "",

      city,

      purpose: "",

      salary:
        salary.trim(),

      obligations:
        obligations.trim(),

      message: "",
    } satisfies IPersonalInfo);
  };

  const isDisabled =
    !fullName.trim() ||
    !phone.trim() ||
    !city.trim();

  return (
    <section
      dir={direction}
      className="w-full"
    >
      {/* Title */}
      <h2
        className={[
          "text-start",
          "text-[26px] font-extrabold",
          "leading-tight",
          "text-[#20283A]",
          "sm:text-[30px]",
        ].join(" ")}
      >
        {t(
          "financeCalculator.step1.personalInfoTitle",
          "بياناتك الشخصية",
        )}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* Full name */}
        <FieldGroup
          label={t(
            "financeCalculator.step1.fullName",
            "الاسم الكامل",
          )}
        >
          <input
            type="text"
            value={fullName}
            onChange={(event) =>
              setFullName(
                event.target.value,
              )
            }
            placeholder={t(
              "financeCalculator.step1.fullNamePlaceholder",
              "اسمك",
            )}
            autoComplete="name"
            className={fieldClassName}
            required
          />
        </FieldGroup>

        {/* Phone */}
        <FieldGroup
          label={t(
            "financeCalculator.step1.phone",
            "رقم الجوال",
          )}
        >
          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value,
              )
            }
            placeholder={t(
              "financeCalculator.step1.phonePlaceholder",
              "05XXXXXXXX",
            )}
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            className={`${fieldClassName} text-end`}
            required
          />
        </FieldGroup>

        {/* City */}
        <FieldGroup
          label={t(
            "financeCalculator.step1.city",
            "المدينة",
          )}
        >
          <input
            list="finance-city-options"
            value={city}
            onChange={(event) =>
              setCity(
                event.target.value,
              )
            }
            placeholder={t(
              "financeCalculator.step1.cityPlaceholder",
              "مثال: الرياض",
            )}
            className={
              fieldClassName
            }
            required
          />

          <datalist id="finance-city-options">
            {cityOptions.map(
              (cityName) => (
                <option
                  key={cityName}
                  value={cityName}
                />
              ),
            )}
          </datalist>
        </FieldGroup>

        {/* Salary + obligations */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup
            label={t(
              "financeCalculator.step1.salary",
              "الراتب",
            )}
          >
            <input
              type="number"
              min="0"
              value={salary}
              onChange={(event) =>
                setSalary(
                  event.target.value,
                )
              }
              placeholder={t(
                "financeCalculator.step1.salaryPlaceholder",
                "مثال: 2000 ر.س",
              )}
              inputMode="numeric"
              className={
                fieldClassName
              }
            />
          </FieldGroup>

          <FieldGroup
            label={t(
              "financeCalculator.step1.obligations",
              "الالتزامات",
            )}
          >
            <input
              type="number"
              min="0"
              value={obligations}
              onChange={(event) =>
                setObligations(
                  event.target.value,
                )
              }
              placeholder={t(
                "financeCalculator.step1.obligationsPlaceholder",
                "مثال: 800 ر.س",
              )}
              inputMode="numeric"
              className={
                fieldClassName
              }
            />
          </FieldGroup>
        </div>

        {/* Next */}
        <button
          type="submit"
          disabled={isDisabled}
          className={[
            "mt-2 flex h-[54px] w-full",
            "items-center justify-center",
            "bg-[var(--brand-primary-color)]",
            "px-6",
            "text-[14px] font-bold",
            "text-[#20283A]",
            "transition duration-300",
            "hover:brightness-95",
            "disabled:cursor-not-allowed",
            "disabled:opacity-45",
          ].join(" ")}
        >
          {t(
            "financeCalculator.step1.nextButton",
            "التالي ←",
          )}
        </button>
      </form>
    </section>
  );
}

interface FieldGroupProps {
  label: string;
  children: React.ReactNode;
}

function FieldGroup({
  label,
  children,
}: FieldGroupProps) {
  return (
    <div>
      <label
        className={[
          "mb-2 block",
          "text-start",
          "text-[11px] font-medium",
          "text-[#303A54]",
        ].join(" ")}
      >
        {label}
      </label>

      {children}
    </div>
  );
}