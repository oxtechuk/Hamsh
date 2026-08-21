import { useTranslation } from "react-i18next";

import type { IContactFormProps } from "../../interfaces/IContactFormProps";
import FormField from "./FormField";

const inputClassName = [
    "h-[48px] w-full",
    "rounded-[4px] border border-[#E7E7E7]",
    "bg-[#E8E3DA]! px-4",
    "text-[12px] text-[#111111] font-semibold!",
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
    isSubmitting,
    onSubmit,
}: IContactFormProps) {
    const { t, i18n } = useTranslation();

    return (
        <section
            dir={i18n.dir()}
            className={[
                "w-full",
                "border border-[#E7E7E7] bg-white",
                "px-5 py-6",
                "shadow-[0_3px_12px_rgba(15,23,42,0.035)]",
                "sm:px-6 sm:py-7",
            ].join(" ")}
        >
            {/* Header */}
            <div className="text-start">
                <h2 className="text-[24px] font-extrabold leading-tight text-[#111111]">
                    {title || t("contactPage.contactUs.title")}
                </h2>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
                {/* Full name */}
                <FormField label={t("contactPage.contactUs.fullNameLabel")}>
                    <input
                        type="text"
                        value={values.fullName}
                        onChange={(event) =>
                            set("fullName", event.target.value)
                        }
                        placeholder={t(
                            "contactPage.contactUs.fullNamePlaceholder",
                        )}
                        className={inputClassName}
                        autoComplete="name"
                        required
                    />
                </FormField>

                {/* Phone */}
                <FormField label={t("contactPage.contactUs.phoneLabel")}>
                    <input
                        type="tel"
                        value={values.phone}
                        onChange={(event) => set("phone", event.target.value)}
                        placeholder={t(
                            "contactPage.contactUs.phonePlaceholder",
                        )}
                        className={`${inputClassName} text-end`}
                        dir="ltr"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                    />
                </FormField>

                {/* Subject */}
                <FormField label={t("contactPage.contactUs.subjectLabel")}>
                    <input
                        type="text"
                        value={values.subject}
                        onChange={(event) => set("subject", event.target.value)}
                        placeholder={t(
                            "contactPage.contactUs.subjectPlaceholder",
                        )}
                        className={inputClassName}
                        required
                    />
                </FormField>

                {/* Message */}
                <FormField label={t("contactPage.contactUs.messageLabel")}>
                    <textarea
                        value={values.message}
                        onChange={(event) => set("message", event.target.value)}
                        placeholder={t(
                            "contactPage.contactUs.messagePlaceholder",
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
                        "rounded-[4px] bg-[#DDBB72]",
                        "px-6 text-[15px] font-bold text-white",
                        "transition duration-300",
                        "hover:bg-[var(--brand-secondary-color)]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                    ].join(" ")}
                >
                    {isSubmitting
                        ? t("contactPage.contactUs.submittingText")
                        : t("contactPage.contactUs.submitText")}
                </button>
            </form>
        </section>
    );
}
