import {
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";

export default function ContactMethodsSection() {
  const { t } = useTranslation();

  const direction = useLanguageStore(
    (state) => state.direction,
  );

  const settings = useSettingsStore(
    (state) => state.settings,
  );

  const phone =
    settings?.contact?.phone ??
    "800 XXX XXXX";

  const whatsapp =
    settings?.contact?.whatsapp ??
    "966500000000";

  const address =
    settings?.contact?.address ??
    "الرياض - حي العليا - طريق الملك فهد";

  return (
    <section
      dir={direction}
      className="w-full bg-[var(--background)] pb-14 pt-8 sm:pb-16 lg:pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-start gap-2 text-[12px]">
          <NavLink
            to="/"
            className="font-semibold text-[#303A54]"
          >
            {t("nav.home", "الرئيسية")}
          </NavLink>

          <span className="text-[#7A8290]">
            ‹
          </span>

          <span className="text-[var(--brand-primary-color)]">
            {t(
              "contactPage.hero.breadcrumb",
              "تواصل معنا",
            )}
          </span>
        </nav>

        {/* Heading */}
        <h1 className="mt-5 text-start text-[32px] font-extrabold leading-tight text-[#20283A] sm:text-[38px] lg:text-[42px]">
          <span>
            {t(
              "contactPage.hero.titlePrefix",
              "نحن هنا من",
            )}
          </span>{" "}
          <span className="text-[var(--brand-primary-color)]">
            {t(
              "contactPage.hero.titleHighlight",
              "أجلك",
            )}
          </span>
        </h1>

        {/* Contact methods */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Direct visit */}
          <ContactMethodCard
            icon={
              <MapPin
                size={30}
                strokeWidth={1.6}
              />
            }
            title={t(
              "contactPage.methods.visit.title",
              "زيارة مباشرة",
            )}
            description={address}
          />

          {/* Phone */}
          <ContactMethodCard
            icon={
              <Phone
                size={30}
                strokeWidth={1.6}
              />
            }
            title={t(
              "contactPage.methods.phone.title",
              "الهاتف",
            )}
            description={`${t(
              "contactPage.methods.phone.hours",
              "أوقات العمل",
            )}، ${phone}`}
            href={`tel:${normalizePhone(phone)}`}
          />

          {/* WhatsApp */}
          <ContactMethodCard
            icon={
              <MessageCircle
                size={30}
                strokeWidth={1.6}
              />
            }
            title={t(
              "contactPage.methods.whatsapp.title",
              "واتساب",
            )}
            description={t(
              "contactPage.methods.whatsapp.description",
              "تواصل فوري على مدار الساعة",
            )}
            href={`https://wa.me/${normalizePhone(
              whatsapp,
            ).replace("+", "")}`}
            external
          />
        </div>
      </div>
    </section>
  );
}

interface ContactMethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
}

function ContactMethodCard({
  icon,
  title,
  description,
  href,
  external = false,
}: ContactMethodCardProps) {
  const content = (
    <div
      className={[
        "flex min-h-[185px] flex-col",
        "items-center justify-center",
        "bg-white px-6 py-8",
        "text-center",
        "transition duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[0_12px_28px_rgba(48,58,84,0.08)]",
      ].join(" ")}
    >
      <div className="text-[var(--brand-primary-color)]">
        {icon}
      </div>

      <h3 className="mt-5 text-[21px] font-extrabold text-[#20283A]">
        {title}
      </h3>

      <p className="mt-2 text-[12px] leading-6 text-[#687084]">
        {description}
      </p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      target={
        external ? "_blank" : undefined
      }
      rel={
        external
          ? "noopener noreferrer"
          : undefined
      }
    >
      {content}
    </a>
  );
}

function normalizePhone(
  phone: string,
): string {
  return phone.replace(/[^\d+]/g, "");
}