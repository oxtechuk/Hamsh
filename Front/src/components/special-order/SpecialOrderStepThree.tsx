import type { FormEvent } from "react";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";
import type { ISpecialOrderStepThreeProps } from "../../interfaces/ISpecialOrderStepThreeProps";

const SALARY_RANGES = [
  "4,000 - 5,000 ر.س",
  "6,000 - 8,000 ر.س",
  "8,000 - 9,000 ر.س",
  "9,000 - 10,000 ر.س",
  "أكثر من 10,000 ر.س",
];

const fieldCls = [
  "w-full",
  "rounded-[8px] border border-[#E5E7EB]",
  "bg-[#F9FAFB] px-4 py-3",
  "text-[14px] text-[#111111]",
  "outline-none placeholder:text-[#9CA3AF]",
  "transition focus:border-[var(--brand-secondary-color)] focus:ring-2 focus:ring-[var(--brand-secondary-color)]/10",
].join(" ");

export default function SpecialOrderStepThree({
  data,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: ISpecialOrderStepThreeProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!data.salaryRange) return;
    onSubmit();
  };

  return (
    <div
      dir={direction}
      className="mx-auto w-full max-w-[600px] rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-8 shadow-sm"
    >
      <h2 className="mb-6 text-center text-[26px] font-extrabold text-[#111111]">
        {t("specialOrder.step3.title", "الميزانية والتمويل")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-3 block text-start text-[14px] font-bold text-[#111111]">
            {t("specialOrder.step3.salaryRange", "نطاق الراتب")}
          </label>
          <div className="space-y-2">
            {SALARY_RANGES.map((range) => {
              const selected = data.salaryRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => onChange("salaryRange", range)}
                  className={[
                    "flex w-full items-center justify-start gap-3 rounded-[8px] border px-4 py-3.5 transition",
                    selected
                      ? "border-[var(--brand-secondary-color)] bg-[var(--brand-secondary-color)]/5"
                      : "border-[#E5E7EB] bg-white hover:border-[var(--brand-secondary-color)]/30",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition",
                      selected
                        ? "border-[var(--brand-secondary-color)]"
                        : "border-[#D1D5DB]",
                    ].join(" ")}
                  >
                    {selected && (
                      <span className="h-[9px] w-[9px] rounded-full bg-[var(--brand-secondary-color)]" />
                    )}
                  </span>
                  <span className="text-[14px] text-[#111111]">{range}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-start text-[14px] font-bold text-[#111111]">
            {t("specialOrder.step3.notes", "ملاحظات إضافية")}
          </label>
          <textarea
            value={data.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder={t(
              "specialOrder.step3.notesPlaceholder",
              "أي مواصفات خاصة أو ملاحظات إضافية...",
            )}
            rows={4}
            className={`${fieldCls} resize-none leading-7`}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] border border-[#374151] text-[15px] font-semibold text-[#374151] transition hover:border-[var(--brand-secondary-color)] hover:text-[var(--brand-secondary-color)]"
          >
            {t("specialOrder.step3.backButton", "رجوع")}
          </button>
          <button
            type="submit"
            disabled={!data.salaryRange || submitting}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[8px] bg-[var(--brand-secondary-color)] text-[15px] font-bold text-white transition hover:bg-[#A91D24] disabled:opacity-40"
          >
            <Send
              size={16}
            />
            {submitting
              ? t("specialOrder.step3.submitting", "جارٍ الإرسال...")
              : t("specialOrder.step3.submit", "إرسال الطلب")}
          </button>
        </div>
      </form>
    </div>
  );
}
