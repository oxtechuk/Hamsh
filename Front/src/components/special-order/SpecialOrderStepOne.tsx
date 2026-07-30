import type { FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "../../services/api";
import { useLanguageStore } from "../../store/language.store";
import type { ISpecialOrderStepOneProps } from "../../interfaces/ISpecialOrderStepOneProps";

const fieldCls = [
  "h-[52px] w-full",
  "rounded-[8px] border border-[#E5E7EB]",
  "bg-[#F9FAFB] px-4",
  "text-[14px] text-[#111111]",
  "outline-none placeholder:text-[#9CA3AF]",
  "transition focus:border-[var(--brand-secondary-color)] focus:ring-2 focus:ring-[var(--brand-secondary-color)]/10",
].join(" ");

export default function SpecialOrderStepOne({ data, onChange, onNext, hideEmail }: ISpecialOrderStepOneProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  const { data: citiesData = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    staleTime: 10 * 60 * 1000,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!data.fullName.trim() || !data.phone.trim() || !data.city) return;
    onNext();
  };

  return (
    <div
      dir={direction}
      className="mx-auto w-full max-w-[600px] rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-8 shadow-sm"
    >
      <h2 className="mb-6 text-start text-[24px] font-extrabold text-[#111111]">
        {t("specialOrder.step1.title", "معلوماتك الشخصية")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-start text-[14px] font-bold text-[#111111]">
            {t("specialOrder.step1.fullName", "الاسم الكامل")} <span className="text-[var(--brand-primary-color)]">*</span>
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder={t("specialOrder.step1.fullNamePlaceholder", "اسمك الكريم")}
            className={fieldCls}
            required
          />
        </div>

        {!hideEmail && (
          <div>
            <label className="mb-1.5 block text-start text-[14px] font-bold text-[#111111]">
              {t("specialOrder.step1.email", "البريد الإلكتروني")} <span className="text-[var(--brand-primary-color)]">*</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder={t("specialOrder.step1.emailPlaceholder", "name@example.com")}
              inputMode="email"
              autoComplete="email"
              className={fieldCls}
              required
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-start text-[14px] font-bold text-[#111111]">
            {t("specialOrder.step1.phone", "رقم الجوال")} <span className="text-[var(--brand-primary-color)]">*</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder={t("specialOrder.step1.phonePlaceholder", "05XXXXXXXX")}
            className={`${fieldCls} text-right`}
            dir="ltr"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-start text-[14px] font-bold text-[#111111]">
            {t("specialOrder.step1.city", "المدينة")} <span className="text-[var(--brand-primary-color)]">*</span>
          </label>
          <div className="relative">
            <select
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              className={`${fieldCls} appearance-none`}
              required
            >
              <option value="" disabled />
              {citiesData.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!data.fullName.trim() || !data.phone.trim() || !data.city || (!hideEmail && !data.email.trim())}
          className="mt-2 flex h-[52px] w-full items-center justify-center rounded-[4px] bg-[var(--brand-secondary-color)] text-[15px] font-bold text-white transition hover:bg-[#A91D24] disabled:opacity-40"
        >
          {t("specialOrder.step1.nextButton", "التالي — تفاصيل السيارة")}
        </button>
      </form>
    </div>
  );
}
