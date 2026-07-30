import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../../store/language.store";
import { getCities } from "../../services/api";
import type { IPersonalInfo } from "../../interfaces/IPersonalInfo";
import type { IStepOneFormProps } from "../../interfaces/IStepOneFormProps";

const fieldClassName = [
  "h-[54px] w-full",
  "rounded-[6px] border border-[#E6E7E9]",
  "bg-[#FAFAFA] px-4",
  "text-[14px] text-[#111111]",
  "outline-none",
  "placeholder:text-[#A1A1A1]",
  "transition duration-300",
  "focus:border-[var(--brand-secondary-color)]",
  "focus:ring-2 focus:ring-[var(--brand-secondary-color)]/10",
].join(" ");

export default function StepOneForm({
  onNext,
}: IStepOneFormProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore(
    (state) => state.direction,
  );

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const { data: citiesData = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    staleTime: 10 * 60 * 1000,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !city.trim()
    ) {
      toast.error(
        t("financeCalculator.validation.fillRequired"),
      );
      return;
    }

    onNext({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: "",
      city,
      purpose: "",
      salary: "",
      obligations: "",
      message: "",
    } satisfies IPersonalInfo);
  };

  return (
    <section
      dir={direction}
      className={[
        "mx-auto w-full max-w-[720px]",
        "rounded-[16px] border border-[#E7E7E7]",
        "bg-white px-5 py-7",
        "shadow-[0_3px_12px_rgba(15,23,42,0.03)]",
        "sm:px-8 sm:py-8",
      ].join(" ")}
    >
      <h2 className="text-start text-[25px] font-extrabold leading-tight text-[#111111] sm:text-[29px]">
        {t(
          "financeCalculator.step1.personalInfoTitle",
          "معلوماتك الشخصية",
        )}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        {/* Full name */}
        <FieldGroup
          label={t(
            "financeCalculator.step1.fullName",
            "الاسم الكامل",
          )}
          required
        >
          <input
            type="text"
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            placeholder={t(
              "financeCalculator.step1.fullNamePlaceholder",
              "اسمك الكريم",
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
          required
        >
          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
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
          required
        >
          <div className="relative">
            <select
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              className={[
                fieldClassName,
                "cursor-pointer appearance-none",
                city ? "text-[#111111]" : "text-[#A1A1A1]",
                direction === "rtl" ? "pl-11" : "pr-11",
              ].join(" ")}
              required
            >
              <option value="" disabled>
                {t("financeCalculator.step1.cityPlaceholder", "اختر المدينة")}
              </option>
              {citiesData.map((c) => (
                <option key={c.id} value={c.name} className="text-[#111111]">
                  {c.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              strokeWidth={1.8}
              className={[
                "pointer-events-none absolute top-1/2",
                "-translate-y-1/2 text-[#8A8A8A]",
                direction === "rtl"
                  ? "left-4"
                  : "right-4",
              ].join(" ")}
            />
          </div>
        </FieldGroup>

        {/* Next */}
        <button
          type="submit"
          disabled={!fullName.trim() || !phone.trim() || !city.trim()}
          className={[
            "flex h-[54px] w-full items-center justify-center",
            "rounded-[4px] bg-[var(--brand-secondary-color)]",
            "px-6 text-[16px] font-bold text-white",
            "transition duration-300",
            "hover:bg-[#A91D24]",
            "disabled:opacity-40",
          ].join(" ")}
        >
          {t(
            "financeCalculator.step1.nextButton",
            "التالي — اختر السيارة",
          )}
        </button>
      </form>
    </section>
  );
}

interface IFieldGroupProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FieldGroup({
  label,
  required = false,
  children,
}: IFieldGroupProps) {
  return (
    <div>
      <label className="mb-2 block text-start text-[13px] font-bold text-[#222222]">
        {label}

        {required && (
          <span className="ms-1 text-[#111111]">*</span>
        )}
      </label>

      {children}
    </div>
  );
}