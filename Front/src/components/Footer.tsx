import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

import type { IFooterProps } from "../interfaces/IFooterProps";
import { useSettingsStore } from "../store/settings.store";
import { useLanguageStore } from "../store/language.store";
import { getSocialIcon } from "../utils/social-icons";
import { APP_IMAGES } from "../constants/app-images";
import LazyImg from "./LazyImg";

interface FooterServiceLink {
  label: string;
  to: string;
}

export default function Footer({
  logoSrc,
  logoAlt = "Logo",
  quickLinks,
  socialLinks: propSocialLinks,
  phone: propPhone,
  email: propEmail,
  address: propAddress,
  copyright: propCopyright,
}: IFooterProps) {
  const { t } = useTranslation();

  const direction = useLanguageStore((state) => state.direction);
  const settings = useSettingsStore((state) => state.settings);

  const isRTL = direction === "rtl";

  const resolvedLogo = logoSrc || settings?.logo_color || APP_IMAGES.LOGO_WHITE;

  const phone =
    settings?.contact?.phone ?? settings?.contact?.sales_phone ?? propPhone;

  const email = settings?.contact?.email ?? propEmail;

  const address = settings?.contact?.address ?? propAddress;

  const copyright = settings?.footer_text ?? propCopyright;

  const socialLinks = settings?.social_media?.length
    ? settings.social_media.map((social) => ({
        name: social.platform ?? social.icon ?? "",
        icon: social.platform ?? social.icon ?? "",
        url: social.url ?? social.link ?? "",
      }))
    : propSocialLinks;

  const services: FooterServiceLink[] = [
    {
      label: t("footer.services.carFinance", "تمويل السيارات"),
      to: "/finance",
    },
    {
      label: t("footer.services.cashPurchase", "شراء نقدي"),
      to: "/cars",
    },
    {
      label: t("footer.services.carReservation", "حجز السيارات"),
      to: "/cars",
    },
    {
      label: t("footer.services.customRequest", "طلب مخصص"),
      to: "/orders/special",
    },
  ];

  return (
    <footer
      dir={direction}
      className="w-full bg-[#040609] pb-[96px] text-white lg:pb-0"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
        {/* Main footer */}
        <div
          className={[
            "grid grid-cols-1 gap-12",
            "pb-16 pt-14",
            "sm:grid-cols-2",
            "lg:grid-cols-[1.2fr_0.75fr_0.75fr_1fr]",
            "lg:gap-12 lg:pb-20 lg:pt-[72px]",
            isRTL ? "" : "",
          ].join(" ")}
        >
          {/* Brand information */}
          <section className="text-start">
            <NavLink to="/" aria-label={t("nav.home")} className="inline-flex">
              <LazyImg
                src={resolvedLogo}
                alt={logoAlt}
                className="h-[72px] w-auto max-w-[150px] object-contain"
              />
            </NavLink>

            <p className="mt-6 max-w-[300px] text-[14px] leading-7 text-white/55">
              {t(
                "footer.companyDescription",
                "وجهتك الأولى للسيارات الفاخرة والعائلية في المملكة العربية السعودية. نقدم أفضل الماركات بأفضل الأسعار وأيسر حلول التمويل.",
              )}
            </p>

            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-7 flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  if (!social.url) {
                    return null;
                  }

                  return (
                    <a
                      key={`${social.name}-${index}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name || `Social link ${index + 1}`}
                      className={[
                        "flex h-[40px] w-[40px]",
                        "items-center justify-center",
                        "rounded-full",
                        "transition duration-300",
                        "hover:-translate-y-1 hover:scale-105",
                      ].join(" ")}
                    >
                      {getSocialIcon(social.icon)}
                    </a>
                  );
                })}
              </div>
            )}
          </section>

          {/* Services */}
          <FooterSection title={t("footer.servicesTitle", "الخدمات")}>
            <nav className="flex flex-col items-start gap-4">
              {services.map((service) => (
                <NavLink
                  key={`${service.to}-${service.label}`}
                  to={service.to}
                  className="text-[14px] text-white/50 transition-colors duration-300 hover:text-white"
                >
                  {service.label}
                </NavLink>
              ))}
            </nav>
          </FooterSection>

          {/* Company links */}
          <FooterSection title={t("footer.companyTitle", "الشركة")}>
            <nav className="flex flex-col items-start gap-4">
              {quickLinks.map((link) => (
                <NavLink
                  key={`${link.to}-${link.label}`}
                  to={link.to}
                  className="text-[14px] text-white/50 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </FooterSection>

          {/* Contact */}
          <FooterSection title={t("footer.contactUs", "تواصل معنا")}>
            <div className="flex flex-col items-start gap-5">
              {phone && (
                <ContactRow
                  value={phone}
                  href={`tel:${normalizePhone(phone)}`}
                  icon={<Phone size={18} strokeWidth={1.8} />}
                />
              )}

              {email && (
                <ContactRow
                  value={email}
                  href={`mailto:${email}`}
                  icon={<Mail size={18} strokeWidth={1.8} />}
                />
              )}

              {address && (
                <ContactRow
                  value={address}
                  icon={<MapPin size={18} strokeWidth={1.8} />}
                />
              )}
            </div>
          </FooterSection>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-white/[0.08] py-8">
          <div className="flex flex-col items-center justify-between gap-5 text-center text-[12px] text-white/35 md:flex-row md:text-start">
            {/* Policy links */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <NavLink
                to="/terms"
                className="transition-colors duration-300 hover:text-white"
              >
                {t("footer.termsAndConditions", "الشروط والأحكام")}
              </NavLink>

              <NavLink
                to="/privacy"
                className="transition-colors duration-300 hover:text-white"
              >
                {t("footer.privacyPolicy", "سياسة الخصوصية")}
              </NavLink>
            </div>

            {/* Copyright */}
            <p>{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterSectionProps {
  title: string;
  children: ReactNode;
}

function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <section className="flex w-full flex-col items-start">
      <h3 className="mb-7 text-start text-[15px] font-bold text-white/80">
        {title}
      </h3>

      <div className="w-full">{children}</div>
    </section>
  );
}

interface ContactRowProps {
  value: string;
  icon: ReactNode;
  href?: string;
}

function ContactRow({ value, icon, href }: ContactRowProps) {
  const content = (
    <div className="group flex items-center gap-3">
      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center text-[#D0242C] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>

      <span
        dir="auto"
        className="break-words text-start text-[14px] leading-6 text-white/45 transition-colors duration-300 group-hover:text-white/75"
      >
        {value}
      </span>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} className="inline-flex">
      {content}
    </a>
  );
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}
