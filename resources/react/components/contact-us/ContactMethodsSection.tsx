import { MapPin, MessageCircle, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";
import { trackWhatsAppClick } from "../../utils/analytics";
import ContactMethodCard from "./ContactMethodCard";

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function formatWhatsAppUrl(rawPhone: string): string {
  if (!rawPhone) return "";
  const trimmed = rawPhone.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("wa.me/")
  ) {
    return trimmed.startsWith("wa.me/") ? `https://${trimmed}` : trimmed;
  }

  let digits = trimmed
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    // Saudi trunk prefix replacement: 05XXXXXXXX -> 9665XXXXXXXX, 01XXXXXXXX -> 9661XXXXXXXX
    digits = "966" + digits.slice(1);
  } else if (digits.length === 9 && digits.startsWith("5")) {
    // Missing both country code and trunk 0: 5XXXXXXXX -> 9665XXXXXXXX
    digits = "966" + digits;
  }

  return `https://wa.me/${digits}`;
}

function formatMapUrl(mapLink?: string, address?: string): string | undefined {
  if (mapLink && mapLink.trim()) {
    const trimmed = mapLink.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(trimmed)) {
      return `https://www.google.com/maps?q=${trimmed.replace(/\s+/g, "")}`;
    }
    return `https://${trimmed}`;
  }

  if (address && address.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address.trim()
    )}`;
  }

  return undefined;
}

export default function ContactMethodsSection() {
  const { t } = useTranslation();
  const direction = useLanguageStore((state) => state.direction);
  const settings = useSettingsStore((state) => state.settings);

  const phone = settings?.contact?.phone;
  const whatsappNumber = settings?.contact?.whatsapp || phone;
  const address =
    settings?.contact?.address || t("contactPage.hero.defaultAddress");
  const mapLink =
    settings?.contact?.map_link || settings?.business_info?.map_link;

  const mapUrl = formatMapUrl(mapLink, address);
  const whatsappUrl = whatsappNumber ? formatWhatsAppUrl(whatsappNumber) : "";
  const phoneUrl = phone ? `tel:${normalizePhone(phone)}` : "";

  const whatsappDescription = whatsappNumber
    ? `${t("contactPage.contactMethods.whatsappDescription")}، ${whatsappNumber}`
    : t("contactPage.contactMethods.whatsappDescription");

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
              href={mapUrl}
              external
            />
          )}

          {phone && (
            <ContactMethodCard
              icon={<Phone size={30} strokeWidth={1.6} />}
              title={t("contactPage.contactMethods.phoneLabel")}
              description={`${t("contactPage.contactMethods.hoursLabel")}، ${phone}`}
              href={phoneUrl}
              transparent
            />
          )}

          {whatsappNumber && (
            <ContactMethodCard
              id="contact-page-whatsapp-btn"
              className="whatsapp-btn whatsapp-button contact-page-whatsapp-btn"
              dataTracking="whatsapp"
              dataId="whatsapp-btn"
              dataChannel="whatsapp_contact_page"
              ariaLabel="WhatsApp"
              onClick={() => trackWhatsAppClick("contact_page")}
              icon={<MessageCircle size={30} strokeWidth={1.6} />}
              title={t("contactPage.contactMethods.whatsappLabel")}
              description={whatsappDescription}
              href={whatsappUrl}
              external
            />
          )}
        </div>
      </div>
    </section>
  );
}
