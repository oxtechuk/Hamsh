import { useState } from "react";
import { useTranslation } from "react-i18next";
import FaqAccordion from "./FaqAccordion";
import type { IFaqSectionProps } from "../../interfaces/IFaqSectionProps";

export default function FaqSection({ faqs }: IFaqSectionProps) {
    const { t, i18n } = useTranslation();
    const [openId, setOpenId] = useState<string | number | null>(null);

    const toggle = (id: string | number) =>
        setOpenId((prev) => (prev === id ? null : id));

    return (
        <section dir={i18n.dir()} className="w-full">
            <div className="mb-8 text-start">
                <h2 className="text-[26px] text-[#111827] md:text-[26px] font-bold">
                    {t("contactPage.faq.titleBlack")}
                </h2>
            </div>

            <div className="space-y-3">
                {faqs.map((faq) => (
                    <FaqAccordion
                        key={faq.id}
                        faq={faq}
                        isOpen={faq.id === openId}
                        onToggle={toggle}
                    />
                ))}
            </div>
        </section>
    );
}
