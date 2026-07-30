import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import FaqSection from "../components/contact-us/FaqSection";
import ContactMethodsSection from "../components/contact-us/ContactMethodsSection";
import ContactForm from "../components/contact-us/ContactForm";
import ContactMap from "../components/ContactMap";
import PageBreadcrumbHeader from "../components/PageBreadcrumbHeader";

import {
  getFaqs,
} from "../services/api";
import { getAboutPageData } from "../services/api/about.service";

import { useLanguageStore } from "../store/language.store";
import { useSEO } from "../utils/useSEO";
import { useContactForm } from "../hooks/useContactForm";

import type { IFaqItem } from "../interfaces/IFaqItem";
import ContactPageLayout from "../components/ContactPageLayout";

export default function ContactPage() {
  const { t } = useTranslation();

  const language = useLanguageStore(
    (state) => state.language,
  );

  const { values, set, submitStatus, isSubmitting, handleSubmit } =
    useContactForm();

  useSEO(
    t("nav.contact"),
    t("contactPage.contactUs.description"),
  );

  const { data: faqs } = useQuery<IFaqItem[]>({
    queryKey: ["faqs", language],
    queryFn: getFaqs,
  });

  const { data: aboutData } = useQuery({
    queryKey: ["about-page", language],
    queryFn: getAboutPageData,
  });

  const branches = (aboutData?.about_branches ?? []).map((b, i) => ({
    id: i,
    city: b.city,
    address: b.address,
    phone: b.phone,
    workingHours: b.working_hours,
    mapUrl: b.map_link,
  }));

  return (
    <>
      <PageBreadcrumbHeader
        title={t("contactPage.hero.title")}
        breadcrumbs={[
          {
            label: t("nav.home"),
            to: "/",
          },
          {
            label: t(
              "contactPage.hero.breadcrumb",
            ),
          },
        ]}
      />

      <ContactPageLayout
        form={
          <ContactForm
            title={t("contactPage.contactUs.title")}
            description={t("contactPage.contactUs.description")}
            values={values}
            set={set}
            submitStatus={submitStatus}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        }
        map={
          <ContactMap
            branches={branches}
          />
        }
        faq={
          <FaqSection faqs={faqs ?? []} />
        }
        bottomContent={
          <ContactMethodsSection />
        }
      />
    </>
  );
}