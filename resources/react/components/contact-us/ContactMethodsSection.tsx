import { MapPin, MessageCircle, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";
import ContactMethodCard from "./ContactMethodCard";

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export default function ContactMethodsSection() {
  const { t } = useTranslation();
  const direction = useLanguageStore((state) => state.direction);
  const settings = useSettingsStore((state) => state.settings);

  const phone = settings?.contact?.phone;
  const whatsapp = settings?.contact?.whatsapp;
  const address = settings?.contact?.address ?? t("contactPage.hero.defaultAddress");

  return (
    <section
      dir={direction}
      className="w-full bg-[var(--background)] pb-14 pt-8 sm:pb-16 lg:pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-start justify-start gap-2 text-[12px]">
          <NavLink
            to="/"
            className="font-semibold text-[#303A54]"
          >
            {t("nav.home")}
          </NavLink>

          <span className="text-[#7A8290]">/</span>

          <span className="text-[var(--brand-primary-color)]">
            {t("contactPage.hero.breadcrumb")}
          </span>
        </nav>

        {/* Heading */}
        <h1 className="mt-5 text-start text-[32px] font-extrabold leading-tight text-[#20283A] sm:text-[38px] lg:text-[42px]">
          <span>{t("contactPage.hero.titlePrefix")}</span>{" "}
          <span className="text-[var(--brand-primary-color)]">
            {t("contactPage.hero.titleHighlight")}
          </span>
        </h1>

        {/* Contact methods */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {address && (
            <ContactMethodCard
              icon={<MapPin size={30} strokeWidth={1.6} />}
              title={t("contactPage.contactMethods.visitTitle")}
              description={address}
            />
          )}

          {phone && (
            <ContactMethodCard
              icon={<Phone size={30} strokeWidth={1.6} />}
              title={t("contactPage.contactMethods.phoneLabel")}
              description={`${t("contactPage.contactMethods.hoursLabel")}، ${phone}`}
              href={`tel:${normalizePhone(phone)}`}
              transparent
            />
          )}

          {whatsapp && (
            <ContactMethodCard
              icon={<MessageCircle size={30} strokeWidth={1.6} />}
              title={t("contactPage.contactMethods.whatsappLabel")}
              description={t("contactPage.contactMethods.whatsappDescription")}
              href={`https://wa.me/${normalizePhone(whatsapp).replace("+", "")}`}
              external
            />
          )}
        </div>
      </div>
    </section>
  );
}
