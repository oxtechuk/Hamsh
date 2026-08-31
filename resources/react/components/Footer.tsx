import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

import type { IFooterProps } from "../interfaces/IFooterProps";
import { useSettingsStore } from "../store/settings.store";
import { useLanguageStore } from "../store/language.store";
import { getSocialIcon } from "../utils/social-icons";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import LazyImg from "./LazyImg";

interface FooterLink {
    label: string;
    to: string;
}

export default function Footer({
    logoSrc,
    logoAlt = "Logo",
    socialLinks: propSocialLinks,
    address: propAddress,
    copyright: propCopyright,
}: IFooterProps) {
    const { t } = useTranslation();

    const direction = useLanguageStore((state) => state.direction);

    const settings = useSettingsStore((state) => state.settings);

    const resolvedLogo = getImageUrl(settings?.logo ?? null) || logoSrc || APP_IMAGES.LOGO_WHITE || APP_IMAGES.LOGO;

    const phone = settings?.contact?.phone ?? settings?.contact?.sales_phone;

    const whatsapp = settings?.contact?.whatsapp ?? "";

    const email = settings?.contact?.email;

    const address = settings?.contact?.address ?? propAddress;

    const copyright = settings?.footer_text ?? propCopyright;

    const description = t("footer.companyDescription", {
        defaultValue:
            "تجربة استثنائية في عالم السيارات الفاخرة. نقدم أرقى الماركات بخدمة تفوق التوقعات.",
    });

    const socialLinks = settings?.social_media?.length
        ? settings.social_media.map((social) => ({
              name: social.platform ?? social.icon ?? "",
              icon: social.platform ?? social.icon ?? "",
              url: social.url ?? social.link ?? "",
          }))
        : propSocialLinks;

    const carLinks: FooterLink[] = [
        {
            label: t("footer.cars.luxurySuv", {
                defaultValue: "فاخر SUV",
            }),
            to: "/cars?type=suv",
        },
        {
            label: t("footer.cars.sedan", {
                defaultValue: "سيدان",
            }),
            to: "/cars?type=sedan",
        },
        {
            label: t("footer.cars.sport", {
                defaultValue: "سبورت",
            }),
            to: "/cars?type=coupe",
        },
        {
            label: t("footer.cars.family", {
                defaultValue: "عائلي",
            }),
            to: "/cars?type=van",
        },
        {
            label: t("footer.cars.pickup", {
                defaultValue: "بيك أب",
            }),
            to: "/cars?type=pickup",
        },
    ];

    const serviceLinks: FooterLink[] = [
        {
            label: t("footer.services.specialOffers", {
                defaultValue: "العروض الخاصة",
            }),
            to: "/offers",
        },
        {
            label: t("footer.services.finance", {
                defaultValue: "التمويل",
            }),
            to: "/finance-calculator",
        },
        {
            label: t("footer.services.customRequest", {
                defaultValue: "طلب مخصص",
            }),
            to: "/orders/special",
        },
    ];

    const companyLinks: FooterLink[] = [
        {
            label: t("footer.company.about", {
                defaultValue: "عن هامش",
            }),
            to: "/about",
        },
        {
            label: t("footer.company.blog", {
                defaultValue: "المدونة",
            }),
            to: "/blog",
        },
        {
            label: t("footer.company.contact", {
                defaultValue: "تواصل معنا",
            }),
            to: "/contact",
        },
    ];

    return (
        <footer
            dir={direction}
            className={[
                "w-full",
                "bg-[#1A1F2E]",
                "pb-[96px] text-white",
                "lg:pb-0",
            ].join(" ")}
        >
            {/* ==================== TOP BRAND AREA ==================== */}

            <div className="border-b border-white/[0.08]">
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-[70px]">
                    <div
                        className={[
                            "grid grid-cols-1 gap-12",
                            "py-12",
                            "lg:grid-cols-2",
                            "lg:items-center",
                            "lg:py-[58px]",
                        ].join(" ")}
                    >
                        {/* Brand heading / description */}
                        <div className="text-start lg:max-w-[520px]">
                            <div className="flex items-center gap-4">
                                <span className="h-[42px] w-[3px] bg-[var(--brand-primary-color)]" />

                                <h2 className="text-[30px] font-extrabold leading-tight text-white sm:text-[34px] lg:text-[38px]">
                                    {t("footer.brandTitle", {
                                        defaultValue: "هامش للتجارة",
                                    })}
                                </h2>
                            </div>

                            <p className="mt-7 max-w-[480px] text-[13px] leading-8 text-white/35 sm:text-[14px]">
                                {description}
                            </p>
                        </div>

                        {/* Logo + socials */}
                        <div className="flex flex-col items-start lg:items-end">
                            <NavLink
                                to="/"
                                className="inline-flex"
                                aria-label={logoAlt}
                            >
                                <LazyImg
                                    src={resolvedLogo}
                                    alt={logoAlt}
                                    className="h-[78px] w-auto max-w-[190px] object-contain sm:h-[86px] brightness-0 invert"
                                />
                            </NavLink>

                            {socialLinks && socialLinks.length > 0 && (
                                <div
                                    dir="ltr"
                                    className="mt-7 flex items-center gap-3"
                                >
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
                                                aria-label={
                                                    social.name ||
                                                    `Social ${index + 1}`
                                                }
                                                className={[
                                                    "flex h-[40px] w-[40px]",
                                                    "items-center justify-center",
                                                    "border border-[var(--brand-primary-color)]/20",
                                                    "text-[var(--brand-primary-color)]",
                                                    "transition duration-300",
                                                    "hover:border-[var(--brand-primary-color)]/60",
                                                    "hover:bg-[var(--brand-primary-color)]/10",
                                                ].join(" ")}
                                            >
                                                {getSocialIcon(social.icon)}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== LINKS ==================== */}

            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-[70px]">
                <div
                    className={[
                        "grid grid-cols-1 gap-12",
                        "py-12 sm:grid-cols-2",
                        "lg:grid-cols-4",
                        "lg:gap-16",
                        "lg:py-[55px]",
                    ].join(" ")}
                >
                    {/* Cars */}
                    <FooterColumn
                        title={t("footer.carsTitle", {
                            defaultValue: "السيارات",
                        })}
                    >
                        <FooterNav links={carLinks} />
                    </FooterColumn>

                    {/* Company */}
                    <FooterColumn
                        title={t("footer.companyTitle", {
                            defaultValue: "الشركة",
                        })}
                    >
                        <FooterNav links={companyLinks} />
                    </FooterColumn>

                    {/* Services */}
                    <FooterColumn
                        title={t("footer.servicesTitle", {
                            defaultValue: "الخدمات",
                        })}
                    >
                        <FooterNav links={serviceLinks} />
                    </FooterColumn>

                    {/* Contact */}
                    <FooterColumn
                        title={t("footer.contactUs", {
                            defaultValue: "تواصل معنا",
                        })}
                    >
                        <div className="flex flex-col items-start gap-4">
                            {phone && (
                                <ContactRow
                                    value={phone}
                                    href={`tel:${normalizePhone(phone)}`}
                                    icon={<Phone size={15} strokeWidth={1.7} />}
                                    dir="ltr"
                                />
                            )}

                            {whatsapp && (
                                <ContactRow
                                    value={whatsapp}
                                    href={`https://wa.me/${normalizePhone(
                                        whatsapp,
                                    ).replace("+", "")}`}
                                    icon={
                                        <MessageCircle
                                            size={15}
                                            strokeWidth={1.7}
                                        />
                                    }
                                    dir="ltr"
                                    external
                                />
                            )}

                            {email && (
                                <ContactRow
                                    value={email}
                                    href={`mailto:${email}`}
                                    icon={<Mail size={15} strokeWidth={1.7} />}
                                    dir="ltr"
                                />
                            )}

                            {address && (
                                <ContactRow
                                    value={address}
                                    icon={
                                        <MapPin size={15} strokeWidth={1.7} />
                                    }
                                />
                            )}
                        </div>
                    </FooterColumn>
                </div>
            </div>

            {/* ==================== BOTTOM ==================== */}

            <div className="border-t border-white/[0.07]">
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-[70px]">
                    <div
                        className={[
                            "flex flex-col items-center justify-between gap-5",
                            "py-7",
                            "text-center text-[11px] text-white/20",
                            "md:flex-row md:text-start",
                        ].join(" ")}
                    >
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                            <NavLink
                                to="/privacy"
                                className="transition-colors hover:text-white/60"
                            >
                                {t("footer.privacyPolicy", {
                                    defaultValue: "سياسة الخصوصية",
                                })}
                            </NavLink>

                            <span className="text-white/10">•</span>

                            <NavLink
                                to="/terms"
                                className="transition-colors hover:text-white/60"
                            >
                                {t("footer.termsAndConditions", {
                                    defaultValue: "الشروط والأحكام",
                                })}
                            </NavLink>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-start">
                            <p>{copyright}</p>
                            <span className="hidden sm:inline text-white/10">•</span>
                            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                                <span>{direction === "rtl" ? "تم التطوير بواسطة" : "Developed by"}</span>
                                <a
                                    href="https://www.digitalplussa.com/ar"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-[var(--brand-primary-color,#EB5E28)] hover:underline transition-colors"
                                >
                                    {direction === "rtl" ? "شركة ديجيتال بلس" : "Digital Plus"}
                                </a>
                                <a
                                    href="http://oxtech.uk/"
                                    target="_blank"
                                    rel="noopener"
                                    className="opacity-0 w-0 h-0 overflow-hidden pointer-events-none absolute text-[0px]"
                                    aria-hidden="true"
                                    tabIndex={-1}
                                >
                                    OxTech
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ========================================================================== */
/* Column                                                                      */
/* ========================================================================== */

interface FooterColumnProps {
    title: string;
    children: ReactNode;
}

function FooterColumn({ title, children }: FooterColumnProps) {
    return (
        <section className="flex min-w-0 flex-col items-start text-start">
            <h3 className="mb-6 text-[13px] font-bold text-[var(--brand-primary-color)]">
                {title}
            </h3>

            <div className="w-full text-white/35">{children}</div>
        </section>
    );
}

/* ========================================================================== */
/* Navigation                                                                  */
/* ========================================================================== */

function FooterNav({ links }: { links: FooterLink[] }) {
    return (
        <nav className="flex flex-col items-start gap-[14px]">
            {links.map((link, index) => (
                <NavLink
                    key={`${link.to}-${link.label}-${index}`}
                    to={link.to}
                    className={[
                        "text-[13px]",
                        "text-white/35",
                        "transition-colors duration-300",
                        "hover:text-[var(--brand-primary-color)]",
                    ].join(" ")}
                >
                    {link.label}
                </NavLink>
            ))}
        </nav>
    );
}

/* ========================================================================== */
/* Contact                                                                     */
/* ========================================================================== */

interface ContactRowProps {
    value: string;
    icon: ReactNode;
    href?: string;
    dir?: "ltr" | "rtl" | "auto";
    external?: boolean;
}

function ContactRow({
    value,
    icon,
    href,
    dir = "auto",
    external = false,
}: ContactRowProps) {
    const content = (
        <div className="group flex items-center gap-3">
            <span
                className={[
                    "flex h-[20px] w-[20px] shrink-0",
                    "items-center justify-center",
                    "text-[var(--brand-primary-color)]",
                    "transition-transform duration-300",
                    "group-hover:scale-110",
                ].join(" ")}
            >
                {icon}
            </span>

            <span
                dir={dir}
                className={[
                    "break-words text-start",
                    "text-[12px] leading-6",
                    "text-white/30",
                    "transition-colors duration-300",
                    "group-hover:text-white/60",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );

    if (!href) {
        return content;
    }

    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="inline-flex"
        >
            {content}
        </a>
    );
}

function normalizePhone(phone: string): string {
    return phone.replace(/[^\d+]/g, "");
}
