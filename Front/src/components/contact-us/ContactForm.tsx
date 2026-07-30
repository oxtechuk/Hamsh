import { Send, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../store/settings.store";
import type { IContactFormProps } from "../../interfaces/IContactFormProps";

const inputClassName = [
  "h-[48px] w-full",
  "rounded-[4px] border border-[#E7E7E7]",
  "bg-[#FAFAFA] px-4",
  "text-[14px] text-[#111111]",
  "outline-none",
  "placeholder:text-[#A5A5A5]",
  "transition duration-300",
  "focus:border-[var(--brand-secondary-color)]",
  "focus:ring-2 focus:ring-[var(--brand-secondary-color)]/10",
].join(" ");

export default function ContactForm({
  title,
  values,
  set,
  submitStatus,
  isSubmitting,
  onSubmit,
}: IContactFormProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const settings = useSettingsStore((state) => state.settings);

  const phone = settings?.contact?.phone ?? "+966 50 000 0000";

  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section
      dir={i18n.dir()}
      className={[
        "w-full rounded-[14px]",
        "border border-[#E7E7E7] bg-white",
        "px-5 py-6",
        "shadow-[0_3px_12px_rgba(15,23,42,0.035)]",
        "sm:px-6 sm:py-7",
      ].join(" ")}
    >
      {/* Header */}
      <div className={isRtl ? "text-right" : "text-left"}>
        <h2 className="text-[24px] font-extrabold leading-tight text-[#111111]">
          {title || t("contactPage.contactUs.title", "أرسل استفسارًا")}
        </h2>
        {/* 
        {description && (
          <p className="mt-2 text-[13px] leading-6 text-[#858585]">
            {description}
          </p>
        )} */}
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        {/* Full name */}
        <FormField
          label={t("contactPage.contactUs.fullNameLabel", "الاسم الكامل")}
        >
          <input
            type="text"
            value={values.fullName}
            onChange={(event) => set("fullName", event.target.value)}
            placeholder={t(
              "contactPage.contactUs.fullNamePlaceholder",
              "اكتب اسمك هنا",
            )}
            className={inputClassName}
            autoComplete="name"
            required
          />
        </FormField>

        {/* Phone */}
        <FormField label={t("contactPage.contactUs.phoneLabel", "رقم الجوال")}>
          <input
            type="tel"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            placeholder={t(
              "contactPage.contactUs.phonePlaceholder",
              "05XXXXXXXX",
            )}
            className={`${inputClassName} text-start`}
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            required
          />
        </FormField>

        {/* Subject */}
        <FormField label={t("contactPage.contactUs.subjectLabel", "الموضوع")}>
          <input
            type="text"
            value={values.subject}
            onChange={(event) => set("subject", event.target.value)}
            placeholder={t(
              "contactPage.contactUs.subjectPlaceholder",
              "استفسار عن سيارة...",
            )}
            className={inputClassName}
            required
          />
        </FormField>

        {/* Message */}
        <FormField label={t("contactPage.contactUs.messageLabel", "الرسالة")}>
          <textarea
            value={values.message}
            onChange={(event) => set("message", event.target.value)}
            placeholder={t(
              "contactPage.contactUs.messagePlaceholder",
              "اكتب رسالتك هنا...",
            )}
            rows={5}
            className={[
              inputClassName,
              "h-[118px] resize-none py-3 leading-7",
            ].join(" ")}
            required
          />
        </FormField>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={[
            "flex h-[52px] w-full items-center justify-center gap-2",
            "rounded-[4px] bg-[var(--brand-secondary-color)]",
            "px-6 text-[15px] font-bold text-white",
            "transition duration-300",
            "hover:bg-[#A91D24]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          {isSubmitting
            ? t("contactPage.contactUs.submittingText", "جارٍ الإرسال...")
            : t("contactPage.contactUs.submitText", "إرسال الرسالة")}
          <Send
            size={17}
            strokeWidth={2}
            className="rtl:-rotate-45 ltr:rotate-45"
          />
        </button>

        {/* Submit status */}
        {submitStatus === "success" && (
          <p className="text-center text-[13px] font-medium text-green-600">
            {t("contactPage.contactUs.successToast", "تم إرسال رسالتك بنجاح")}
          </p>
        )}

        {submitStatus === "error" && (
          <p className="text-center text-[13px] font-medium text-red-600">
            {t("contactPage.contactUs.errorToast", "تعذر إرسال الرسالة")}
          </p>
        )}

        {/* Phone */}
        {phone && (
          <a
            href={phoneHref}
            dir="ltr"
            className={[
              "flex w-fit items-start gap-2 text-start",
              "pt-1 text-[12px] text-[#989898]",
              "transition-colors duration-300",
              "hover:text-[var(--brand-secondary-color)]",
            ].join(" ")}
          >
            <span>{phone}</span>

            <Phone
              size={14}
              strokeWidth={1.8}
              className="text-[var(--brand-secondary-color)]"
            />
          </a>
        )}
      </form>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

function FormField({ label, children }: FormFieldProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  return (
    <div>
      <label
        className={`mb-1.5 block text-[12px] font-bold text-[#222222] ${isRtl ? "text-right" : "text-left"}`}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
