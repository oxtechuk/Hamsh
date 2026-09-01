import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguageStore } from "../store/language.store";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import { getSettings } from "../services/api";
import { useSettingsStore } from "../store/settings.store";
import TopBar from "../components/top-bar";
import Header from "../components/header";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import ScrollToTop from "../components/ScrollToTop";
import WhatsAppWidget from "../components/WhatsAppWidget";
import MaintenancePage from "./MaintenancePage";

export default function RootLayout() {
  const { t } = useTranslation();
  const { language, direction, setLanguage } = useLanguageStore();
  const { loaded, settings, setSettings, setLoading } = useSettingsStore();

  useEffect(() => {
    if (loaded) return;
    setLoading(true);
    getSettings().then(setSettings).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const favPath = settings?.favicon || settings?.logo || null;
    const faviconUrl = favPath ? getImageUrl(favPath) : APP_IMAGES.LOGO;
    if (faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [loaded, settings]);

  if (settings?.maintenance?.enabled && !settings?.maintenance?.is_admin) {
    return <MaintenancePage />;
  }

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.cars"), path: "/cars" },
    { label: t("nav.offers"), path: "/offers" },
    { label: t("nav.calculator"), path: "/finance-calculator" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.blog"), path: "/blog" },
    { label: t("nav.orders"), path: "/orders/special" },
  ];

  return (
    <div dir={direction} className="min-h-screen pt-0 sm:pt-[30px]">
      {/* Admin Maintenance Mode Indicator */}
      {settings?.maintenance?.enabled && settings?.maintenance?.is_admin && (
        <div className="bg-[#1A1F2E] text-amber-300 border-b border-amber-500/40 text-xs sm:text-sm font-bold py-2 px-4 text-center shadow-lg flex items-center justify-center gap-2 sticky top-0 z-50">
          <span>⚠️ {language === "ar" ? "وضع الصيانة مفعل حالياً للزوار — أنت تتصفح الموقع كمسؤول" : "Maintenance mode is active for visitors — You are browsing as Admin"}</span>
          <a
            href="/crm/settings/general"
            className="underline text-white hover:text-amber-200 ms-2 text-xs font-semibold"
          >
            {language === "ar" ? "إعدادات الصيانة" : "Settings"}
          </a>
        </div>
      )}

      <ScrollToTop />
      <ToastContainer
        position="top-center"
        rtl={language === "ar"}
        theme="colored"
      />

      <TopBar
        location={settings?.contact?.address || t("topbar.locationValue")}
        onLanguageToggle={() => setLanguage(language === "en" ? "ar" : "en")}
      />

      <div className="hidden md:block sticky top-[35px] sm:top-[35px] z-40">
        <Header
          logoSrc={getImageUrl(settings?.logo ?? null) || APP_IMAGES.LOGO}
          logoAlt={t("rootLayout.logoAlt")}
          navItems={navItems}
          ctaText={t("nav.contact")}
          ctaPath="/contact"
        />
      </div>

      <main className="pb-[96px] md:pb-0">
        <Outlet />
      </main>

      <div className="hidden md:block">
        <Footer
        logoSrc={getImageUrl(settings?.logo ?? null) || APP_IMAGES.LOGO}
        logoAlt={t("rootLayout.logoAlt")}
        socialLinks={[
          {
            name: "TikTok",
            icon: APP_IMAGES.SOCIAL_TIKTOK,
            url: "https://www.tiktok.com",
          },
          {
            name: "Facebook",
            icon: APP_IMAGES.SOCIAL_FACEBOOK,
            url: "https://www.facebook.com",
          },
          {
            name: "Instagram",
            icon: APP_IMAGES.SOCIAL_INSTAGRAM,
            url: "https://www.instagram.com",
          },
        ]}
        address={t("rootLayout.address")}
        copyright={t("rootLayout.copyright")}
      />
      </div>

      <MobileBottomNav />
      <WhatsAppWidget />
    </div>
  );
}
