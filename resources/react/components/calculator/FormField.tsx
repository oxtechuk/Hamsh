import { useTranslation } from "react-i18next";
import type { IFormFieldProps } from "../../interfaces/IFormFieldProps";

export default function FormField({ label, required, children }: IFormFieldProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <label className="block">
      <span
        className={`mb-3 block text-[15px] font-extrabold text-[#07111F] ${
          isRTL ? "text-end" : "text-start"
        }`}
      >
        {label}
        {required && (
          <span className="ms-1 text-[var(--brand-secondary-color)]">*</span>
        )}
      </span>
      {children}
    </label>
  );
}
