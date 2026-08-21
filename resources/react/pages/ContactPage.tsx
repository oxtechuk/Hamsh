import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import FaqSection from "../components/contact-us/FaqSection";
import ContactMethodsSection from "../components/contact-us/ContactMethodsSection";
import ContactForm from "../components/contact-us/ContactForm";
import ContactPageLayout from "../components/ContactPageLayout";
import ContactPageSkeleton from "../components/ContactPageSkeleton";

import { useSEO } from "../utils/useSEO";
import { useContactForm } from "../hooks/useContactForm";
import { useLanguageStore } from "../store/language.store";
import { getAboutPageData, getFaqs } from "../services/api";

import type { IContactBranchItem } from "../interfaces/IContactBranchItem";

export default function ContactPage() {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  const { values, set, isSubmitting, handleSubmit } =
    useContactForm();

  useSEO(t("nav.contact"), t("contactPage.contactUs.description"));

  const { data: faqs = [], isPending: isFaqsPending } = useQuery({
    queryKey: ["faqs", language],
    queryFn: getFaqs,
  });

  const { data: aboutData, isPending: isAboutPending } = useQuery({
    queryKey: ["about-page", language],
    queryFn: getAboutPageData,
  });

  const branches: IContactBranchItem[] = useMemo(() => {
    return (aboutData?.about_branches ?? []).map((b, i) => ({
      id: b.city || i,
      city: b.city,
      name: b.name,
    }));
  }, [aboutData]);

  if (isFaqsPending || isAboutPending) {
    return <ContactPageSkeleton />;
  }

  return (
    <main className="w-full bg-[var(--background)]">
      {/* Top intro + contact methods */}
      <ContactMethodsSection />

      {/* Form + FAQ / branches */}
      <ContactPageLayout
        form={
          <ContactForm
            title={t("contactPage.contactUs.title")}
            description={t("contactPage.contactUs.description")}
            values={values}
            set={set}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        }
        faq={<FaqSection faqs={faqs} />}
        branches={branches}
      />
    </main>
  );
}
