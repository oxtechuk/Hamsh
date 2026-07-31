import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";
import type { ISpecialOrderStepTwoProps } from "../../interfaces/ISpecialOrderStepTwoProps";

const BRANDS = [
  "تويوتا",
  "مرسيدس",
  "BMW",
  "لكزس",
  "بورش",
  "فورد",
  "هيونداي",
  "GMC",
  "أخرى",
];

const fieldCls = [
  "h-[52px] w-full",
  "rounded-[8px] border border-[#E5E7EB]",
  "bg-[#F9FAFB] px-4",
  "text-[14px] text-[#111111]",
  "outline-none placeholder:text-[#9CA3AF]",
  "transition focus:border-[var(--brand-secondary-color)] focus:ring-2 focus:ring-[var(--brand-secondary-color)]/10",
].join(" ");

export default function SpecialOrderStepTwo({
  data,
  onChange,
  onNext,
  onBack,
}: ISpecialOrderStepTwoProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!data.brand || !data.color || !data.year) return;
    onNext();
  };

  return (
    <div
      dir={direction}
      className="mx-auto w-full max-w-[600px] rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-8 shadow-sm"
    >
      <h2 className="mb-6 text-center text-[26px] font-extrabold text-[#111111]">
        {t("specialOrder.step2.title", "تفاصيل السيارة المطلوبة")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-3 block text-start text-[14px] font-bold text-[#111111]">
            {t("specialOrder.step2.brand", "العلامة التجارية")}<span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap justify-start gap-2">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => onChange("brand", brand)}
                className={[
                  "rounded-[8px] border px-5 py-2.5 text-[14px] font-medium transition",
                  data.brand === brand
                    ? "border-[var(--brand-secondary-color)] bg-[var(--brand-secondary-color)] text-white"
                    : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[var(--brand-secondary-color)]/50",
                ].join(" ")}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-start text-[14px] font-bold text-[#111111]">
            {t("specialOrder.step2.model", "الموديل (اختياري)")}
          </label>
          <input
            type="text"
            value={data.model}
            onChange={(e) => onChange("model", e.target.value)}
            placeholder={t(
              "specialOrder.step2.modelPlaceholder",
              "مثال: لاند كروزر، X5، Camry...",
            )}
            className={fieldCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-start text-[14px] font-bold text-[#111111]">
              {t("specialOrder.step2.color", "اللون المفضل")}<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.color}
              onChange={(e) => onChange("color", e.target.value)}
              placeholder=""
              className={fieldCls}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-start text-[14px] font-bold text-[#111111]">
              {t("specialOrder.step2.year", "سنة الموديل")}<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.year}
              onChange={(e) => onChange("year", e.target.value)}
              placeholder=""
              className={fieldCls}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] border border-[#374151] text-[15px] !font-bold text-[#000000] transition hover:border-[var(--brand-secondary-color)] hover:text-[var(--brand-secondary-color)]"
          >
            {t("specialOrder.step2.backButton", "رجوع")}
          </button>
          <button
            type="submit"
            disabled={!data.brand || !data.color || !data.year}
            className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] bg-[var(--brand-secondary-color)] text-[15px] font-bold text-white transition hover:bg-[#A91D24] disabled:opacity-40"
          >
            {t("specialOrder.step2.nextButton", "التالي — الميزانية")}
          </button>
        </div>
      </form>
    </div>
  );
}
