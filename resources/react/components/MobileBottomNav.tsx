import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../store/language.store";
import { useSettingsStore } from "../store/settings.store";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import {
  X,
  Info,
  Phone,
  Newspaper,
  Languages,
  MapPin,
  Mail,
  ShoppingBag,
  Home,
  CarFront,
  Tags,
  Menu,
  MessageCircle,
  Calculator,
  Flame,
  ChevronRight,
  Headphones,
  Zap,
} from "lucide-react";
import LazyImg from "./LazyImg";

const drawerLinks = [
  { labelKey: "nav.cars", to: "/cars", icon: CarFront },
  { labelKey: "nav.offers", to: "/offers", icon: Tags },
  { labelKey: "nav.calculator", to: "/finance-calculator", icon: Calculator },
  { labelKey: "nav.orders", to: "/orders/special", icon: ShoppingBag },
  { labelKey: "nav.about", to: "/about", icon: Info },
  { labelKey: "mobileNav.blog", to: "/blog", icon: Newspaper },
  { labelKey: "nav.contact", to: "/contact", icon: Phone },
];

export default function MobileBottomNav() {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useSettingsStore((s) => s.settings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const isRTL = direction === "rtl";

  const phone = settings?.contact?.phone ?? "";
  const whatsappNumber = (settings?.contact?.whatsapp || phone).replace(/[^0-9]/g, "");
  const address = settings?.contact?.address || t("topbar.locationValue");
  const email = settings?.contact?.email;

  const handleActionClick = (action: () => void) => {
    setQuickActionOpen(false);
    action();
  };

  return (
    <>
      {/* =========================================================================
          Bottom Navigation Bar
          ========================================================================= */}
      <nav
        dir={direction}
        className="fixed bottom-0 left-0 right-0 z-50 block md:hidden pb-[max(0.25rem,env(safe-area-inset-bottom))]"
      >
        <div className="relative mx-auto flex h-[66px] items-center justify-around border-t border-black/[0.06] bg-white/95 px-2 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          {/* 1. Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive ? "text-[var(--brand-secondary-color)] scale-105 font-bold" : "text-[#8E95A2] font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full transition ${isActive ? "bg-[var(--brand-secondary-color)]/10" : ""}`}>
                  <Home size={19} strokeWidth={isActive ? 2.3 : 1.8} />
                </div>
                <span className="text-[11px] leading-none tracking-tight">
                  {t("mobileNav.home", { defaultValue: "الرئيسية" })}
                </span>
              </>
            )}
          </NavLink>

          {/* 2. All Cars */}
          <NavLink
            to="/cars"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive ? "text-[var(--brand-secondary-color)] scale-105 font-bold" : "text-[#8E95A2] font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full transition ${isActive ? "bg-[var(--brand-secondary-color)]/10" : ""}`}>
                  <CarFront size={19} strokeWidth={isActive ? 2.3 : 1.8} />
                </div>
                <span className="text-[11px] leading-none tracking-tight">
                  {t("mobileNav.newCars", { defaultValue: "السيارات" })}
                </span>
              </>
            )}
          </NavLink>

          {/* 3. Center High-Impact Sales Action Button */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setQuickActionOpen(true)}
              className="group relative -top-3 flex flex-col items-center focus:outline-none"
              aria-label="تواصل سريع ومبيعات"
            >
              {/* Outer soft glowing pulse */}
              <span className="absolute -inset-1 rounded-full bg-[var(--brand-primary-color)]/40 opacity-75 blur-sm animate-pulse" />

              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-tr from-[#1D2437] via-[#2A344E] to-[var(--brand-secondary-color)] text-[var(--brand-primary-color)] shadow-[0_8px_20px_rgba(29,36,55,0.35)] transition-all duration-300 active:scale-95 group-hover:scale-105 group-hover:shadow-[0_10px_25px_rgba(221,187,114,0.3)]">
                <Zap size={23} strokeWidth={2.4} className="fill-[var(--brand-primary-color)] text-[var(--brand-primary-color)] transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <span className="mt-0.5 text-[10px] font-extrabold text-[#1D2437]">
                {t("mobileNav.quickAction", { defaultValue: "تواصل سريع" })}
              </span>
            </button>
          </div>

          {/* 4. Offers (With Hot Badge) */}
          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive ? "text-[#E04F44] scale-105 font-bold" : "text-[#8E95A2] font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative flex h-7 w-7 items-center justify-center rounded-full transition ${isActive ? "bg-red-50" : ""}`}>
                  <Flame size={19} strokeWidth={isActive ? 2.3 : 1.8} className={isActive ? "text-[#E04F44]" : ""} />
                  {/* Small Hot indicator */}
                  <span className="absolute -top-0.5 -end-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E04F44]" />
                  </span>
                </div>
                <span className="text-[11px] leading-none tracking-tight">
                  {t("mobileNav.offers", { defaultValue: "العروض" })}
                </span>
              </>
            )}
          </NavLink>

          {/* 5. Menu / More */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 text-[#8E95A2] transition-all duration-200 active:scale-95 hover:text-[#1D2437] font-medium"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full">
              <Menu size={19} strokeWidth={1.8} />
            </div>
            <span className="text-[11px] leading-none tracking-tight">
              {t("mobileNav.more", { defaultValue: "المزيد" })}
            </span>
          </button>
        </div>
      </nav>

      {/* =========================================================================
          Quick Sales Hub Modal (Bottom Sheet)
          ========================================================================= */}
      {quickActionOpen && (
        <div className="fixed inset-0 z-[80] block md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setQuickActionOpen(false)}
          />

          {/* Bottom Sheet Card */}
          <div
            dir={direction}
            className="fixed bottom-0 left-0 right-0 z-[90] max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-white p-6 pb-10 shadow-2xl transition-transform animate-slideUp"
          >
            {/* Grab Bar */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-black text-[#1D2437]">
                  {t("mobileNav.quickHubTitle", { defaultValue: "خدمة المبيعات السريعة" })}
                </h3>
                <p className="text-[12px] text-gray-500">
                  {t("mobileNav.quickHubSubtitle", { defaultValue: "اختر الطريقة الأنسب لك للتواصل الفوري مع مستشارينا" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuickActionOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="flex flex-col gap-3">
              {/* WhatsApp Sales */}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 transition-all active:scale-[0.98] hover:bg-emerald-100/70"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
                      <MessageCircle size={22} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-extrabold text-[#0D3B2E]">
                        {t("mobileNav.whatsappSales", { defaultValue: "محادثة واتساب مبيعات" })}
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        {t("mobileNav.whatsappHint", { defaultValue: "رد فوري واستفسار عن التوفر والأسعار" })}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`text-emerald-600 ${isRTL ? "rotate-180" : ""}`} />
                </a>
              )}

              {/* Direct Call */}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 p-4 transition-all active:scale-[0.98] hover:bg-blue-100/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-secondary-color)] text-white shadow-sm shadow-slate-900/20">
                      <Headphones size={22} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-extrabold text-[#1D2437]">
                        {t("mobileNav.callSales", { defaultValue: "اتصال هاتفي مباشر" })}
                      </h4>
                      <p className="text-[11px] text-gray-500">{phone}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`text-gray-400 ${isRTL ? "rotate-180" : ""}`} />
                </a>
              )}

              {/* Special Order */}
              <button
                type="button"
                onClick={() => handleActionClick(() => navigate("/orders/special"))}
                className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-start transition-all active:scale-[0.98] hover:bg-amber-100/50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C5A04E] to-[var(--brand-primary-color)] text-[#1D2437] shadow-sm">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-extrabold text-[#1D2437]">
                      {t("mobileNav.specialOrder", { defaultValue: "طلب سيارة بمواصفات خاصة" })}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {t("mobileNav.specialOrderHint", { defaultValue: "نوفر لك أي سيارة غير متوفرة في السوق" })}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className={`text-gray-400 ${isRTL ? "rotate-180" : ""}`} />
              </button>

              {/* Finance Calculator */}
              <button
                type="button"
                onClick={() => handleActionClick(() => navigate("/finance-calculator"))}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 text-start transition-all active:scale-[0.98] hover:bg-gray-100/80"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-white shadow-sm">
                    <Calculator size={22} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-extrabold text-[#1D2437]">
                      {t("mobileNav.financeCalculator", { defaultValue: "حاسبة التمويل والأقساط" })}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {t("mobileNav.financeCalculatorHint", { defaultValue: "احسب قسطك الشهري مع جميع البنوك" })}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className={`text-gray-400 ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          Main Sidebar Drawer (More Menu)
          ========================================================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 bottom-0 z-[100] w-[82vw] max-w-[340px] bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isRTL ? "right-0" : "left-0"
        } ${
          sidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <LazyImg
              src={getImageUrl(settings?.logo ?? null) || APP_IMAGES.LOGO}
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#34495E] hover:bg-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links list */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-1">
              {drawerLinks.map((link) => {
                const LinkIcon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-bold transition ${
                      isActive
                        ? "bg-[var(--brand-secondary-color)]/10 text-[var(--brand-secondary-color)]"
                        : "text-[#1D2437] hover:bg-gray-50"
                    }`}
                  >
                    <LinkIcon size={19} strokeWidth={2} />
                    <span>{t(link.labelKey)}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Dynamic Showroom Info Card from CRM */}
            <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4 border border-gray-100 flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {t("mobileNav.contactInfo", { defaultValue: "بيانات المعرض" })}
              </span>

              {address && (
                <div className="flex items-start gap-2.5 text-[13px] font-medium text-[#1D2437]">
                  <MapPin size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-[var(--brand-primary-color)]" />
                  <span className="leading-snug">{address}</span>
                </div>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-[#1D2437] hover:text-[var(--brand-secondary-color)]"
                >
                  <Phone size={16} strokeWidth={2} className="shrink-0 text-[var(--brand-primary-color)]" />
                  <span dir="ltr">{phone}</span>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-[#1D2437] hover:text-[var(--brand-secondary-color)]"
                >
                  <Mail size={16} strokeWidth={2} className="shrink-0 text-[var(--brand-primary-color)]" />
                  <span className="truncate">{email}</span>
                </a>
              )}
            </div>

            {/* Language switch */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  const { language, setLanguage } = useLanguageStore.getState();
                  setLanguage(language === "en" ? "ar" : "en");
                  setSidebarOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-[14px] font-bold text-[#1D2437] hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Languages size={18} />
                  <span>{t("topbar.language", { defaultValue: "English / العربية" })}</span>
                </div>
                <span className="text-[12px] font-normal text-gray-400">
                  {direction === "rtl" ? "English" : "العربية"}
                </span>
              </button>
            </div>

            {/* Quick Contact CTA */}
            <div className="mt-5 pb-6">
              <NavLink
                to="/contact"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-secondary-color)] py-3.5 text-[14px] font-bold text-white shadow-md shadow-slate-900/10 transition hover:brightness-110 active:scale-[0.99]"
              >
                <Phone size={17} />
                {t("nav.contact", { defaultValue: "تواصل معنا" })}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

