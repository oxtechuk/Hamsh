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

    const businessInfo = settings?.business_info;
    const crNumber = businessInfo?.cr_number;
    const taxNumber = businessInfo?.tax_number;
    const maroofNumber = businessInfo?.maroof_number;
    const maroofUrl = businessInfo?.maroof_url;
    const mapUrl = businessInfo?.map_link || (address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined);
    const showFooterMap = businessInfo?.show_footer_map !== false && (businessInfo?.map_link || address);

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

            {/* ==================== GPS LOCATION CARD ==================== */}
            {showFooterMap && (
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-[70px] pb-12">
                    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#121724] to-[#1E2638] p-8 text-center shadow-xl sm:p-12">
                        {/* Map pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-15 pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(221, 187, 114, 0.2) 0%, transparent 60%), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                                backgroundSize: '100% 100%, 32px 32px, 32px 32px'
                            }}
                        />

                        <div className="relative z-10 flex flex-col items-center justify-center">
                            {/* Pin Icon with animated pulse */}
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[var(--brand-primary-color,#DDBB72)] shadow-inner backdrop-blur-md border border-white/20">
                                <MapPin size={30} strokeWidth={2.2} className="animate-bounce text-[var(--brand-primary-color,#DDBB72)]" />
                            </div>

                            {/* Heading */}
                            <h3 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                {t("footer.ourLocation", { defaultValue: "موقعنا" })}
                            </h3>

                            {address && (
                                <p className="mb-6 max-w-[500px] text-sm text-white/60 sm:text-base">
                                    {address}
                                </p>
                            )}

                            {/* View Location Button */}
                            {mapUrl && (
                                <a
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        backgroundColor: "var(--brand-button-bg, var(--brand-primary-color, #DDBB72))",
                                        color: "var(--brand-button-text, #20283A)",
                                    }}
                                    className="inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-base font-bold shadow-lg transition duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
                                >
                                    <span>{t("footer.viewLocation", { defaultValue: "اعرض الموقع" })}</span>
                                    <span className="text-xl leading-none">↗</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== OFFICIAL TRUST / BUSINESS BADGES ==================== */}
            {(crNumber || taxNumber || maroofNumber) && (
                <div className="border-t border-white/[0.08] py-7 bg-black/20">
                    <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-[70px]">
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                            {/* السجل التجاري */}
                            {crNumber && (
                                <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3.5 backdrop-blur-md shadow-sm transition hover:border-white/25">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-sm">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="text-start">
                                        <span className="block text-[11px] font-semibold text-white/50">
                                            {t("footer.crNumber", { defaultValue: "السجل التجاري" })}
                                        </span>
                                        <span className="block text-sm font-extrabold tracking-wider text-white" dir="ltr">
                                            {crNumber}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* الرقم الضريبي */}
                            {taxNumber && (
                                <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3.5 backdrop-blur-md shadow-sm transition hover:border-white/25">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-sm">
                                        <span className="text-xs font-black tracking-tight">VAT</span>
                                    </div>
                                    <div className="text-start">
                                        <span className="block text-[11px] font-semibold text-white/50">
                                            {t("footer.taxNumber", { defaultValue: "الرقم الضريبي" })}
                                        </span>
                                        <span className="block text-sm font-extrabold tracking-wider text-white" dir="ltr">
                                            {taxNumber}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* معروف */}
                            {maroofNumber && (
                                <a
                                    href={maroofUrl || undefined}
                                    target={maroofUrl ? "_blank" : undefined}
                                    rel={maroofUrl ? "noopener noreferrer" : undefined}
                                    className={`flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3.5 backdrop-blur-md shadow-sm transition ${maroofUrl ? "hover:border-cyan-400/60 hover:bg-white/[0.08] cursor-pointer" : ""}`}
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-sm">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div className="text-start">
                                        <span className="block text-[11px] font-semibold text-white/50">
                                            {t("footer.maroof", { defaultValue: "معروف" })}
                                        </span>
                                        <span className="block text-sm font-extrabold tracking-wider text-white" dir="ltr">
                                            {maroofNumber}
                                        </span>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                    className="font-medium text-[var(--brand-primary-color,#c59b27)] hover:underline transition-colors"
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
