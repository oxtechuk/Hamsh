import { useTranslation } from "react-i18next";

import FaqSection from "../components/contact-us/FaqSection";
import ContactMethodsSection from "../components/contact-us/ContactMethodsSection";
import ContactForm from "../components/contact-us/ContactForm";
import ContactPageLayout from "../components/ContactPageLayout";

import { useSEO } from "../utils/useSEO";
import { useContactForm } from "../hooks/useContactForm";

import type { IFaqItem } from "../interfaces/IFaqItem";

interface ContactBranchItem {
  id: string | number;
  city: string;
  address?: string;
  phone?: string;
  workingHours?: string;
  mapUrl?: string;
}

const STATIC_FAQS: IFaqItem[] = [
  {
    id: 1,
    question: "ما هي مدة الضمان على السيارات المستعملة؟",
    answer:
      "تشمل جميع سياراتنا ضماناً معتمداً يصل حتى سنة أو حسب نوع السيارة، ونقدم لك تقرير فحص شاملاً قبل الشراء.",
  },
  {
    id: 2,
    question: "هل يمكن استبدال سيارتي القديمة ضمن عملية الشراء؟",
    answer:
      "نعم، نوفر خدمة تقييم واستبدال سيارتك الحالية مقابل سيارة جديدة بأسعار منافسة وإجراءات سريعة وميسّرة.",
  },
  {
    id: 3,
    question: "ما هي خيارات الدفع المتاحة؟",
    answer:
      "نوفر الدفع النقدي والتحويل البنكي والتمويل عبر البنوك المعتمدة، مع إمكانية التقسيط وفق البرنامج المناسب لك.",
  },
  {
    id: 4,
    question: "هل يمكنني تجربة قيادة السيارة قبل الشراء؟",
    answer:
      "بالتأكيد، يمكنك حجز موعد لتجربة قيادة السيارة التي ترغب بها في أقرب فرع من فروعنا.",
  },
];

const STATIC_BRANCHES: ContactBranchItem[] = [
  {
    id: 1,
    city: "الرياض",
    address: "حي العليا - طريق الملك فهد",
    phone: "920000001",
    workingHours: "السبت - الخميس: 9:00 ص - 10:00 م",
    mapUrl: "https://maps.google.com/?q=Qemt+Najd+Riyadh",
  },
  {
    id: 2,
    city: "جدة",
    address: "حي التحلية - شارع الأمير سلطان",
    phone: "920000002",
    workingHours: "السبت - الخميس: 10:00 ص - 11:00 م",
    mapUrl: "https://maps.google.com/?q=Qemt+Najd+Jeddah",
  },
  {
    id: 3,
    city: "الدمام",
    address: "حي الشاطئ - طريق الملك عبدالعزيز",
    phone: "920000003",
    workingHours: "الأحد - الخميس: 9:00 ص - 9:00 م",
    mapUrl: "https://maps.google.com/?q=Qemt+Najd+Dammam",
  },
];

export default function ContactPage() {
  const { t } = useTranslation();

  const {
    values,
    set,
    submitStatus,
    isSubmitting,
    handleSubmit,
  } = useContactForm();

  useSEO(
    t("nav.contact"),
    t("contactPage.contactUs.description"),
  );

  return (
    <main className="w-full bg-[var(--background)]">
      {/* Top intro + contact methods */}
      <ContactMethodsSection />

      {/* Form + FAQ / branches */}
      <ContactPageLayout
        form={
          <ContactForm
            title={t(
              "contactPage.contactUs.title",
              "أرسل استفساراً",
            )}
            description={t(
              "contactPage.contactUs.description",
              "",
            )}
            values={values}
            set={set}
            submitStatus={submitStatus}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        }
        faq={<FaqSection faqs={STATIC_FAQS} />}
        branches={STATIC_BRANCHES}
      />
    </main>
  );
}
