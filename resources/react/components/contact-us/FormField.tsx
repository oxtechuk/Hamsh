import { useTranslation } from "react-i18next";
import type { IFormFieldProps } from "../../interfaces/IFormFieldProps";

export default function FormField({ label, required, children }: IFormFieldProps) {
  const { i18n } = useTranslation();

  return (
    <label className="block" dir={i18n.dir()}>
      <span className="mb-3 block text-start text-[15px] font-semibold text-[#07111F]">
        {label}
        {required && (
          <span className="ms-1 text-[var(--brand-secondary-color)]">*</span>
        )}
      </span>
      {children}
    </label>
  );
}
