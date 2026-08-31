import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wrench,
  RotateCw,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useSettingsStore } from "../store/settings.store";
import { useLanguageStore } from "../store/language.store";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";

export default function MaintenancePage() {
  const { t } = useTranslation();
  const { language, setLanguage, direction } = useLanguageStore();
  const { settings } = useSettingsStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const maintenanceData = settings?.maintenance;
  const contact = settings?.contact;

  const title =
    maintenanceData?.title?.trim() || t("maintenance.defaultTitle");
  const message =
    maintenanceData?.message?.trim() || t("maintenance.defaultMessage");
  const customImage = maintenanceData?.image
    ? getImageUrl(maintenanceData.image)
    : null;
  const logo = getImageUrl(settings?.logo ?? null) || APP_IMAGES.LOGO;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <div
      dir={direction}
      className="min-h-screen relative flex flex-col justify-between bg-[#F8FAFC] text-gray-900 selection:bg-[#DDBB72] selection:text-white font-sans overflow-hidden"
    >
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#DDBB72]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-[#DDBB72]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid subtle pattern for luxury texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={settings?.site_name || "Logo"}
                className="h-12 sm:h-14 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight">
                <span className="w-10 h-10 rounded-xl bg-[#DDBB72] flex items-center justify-center text-white shadow-md shadow-[#DDBB72]/30">
                  <Wrench className="w-5 h-5" />
                </span>
                <span>{settings?.site_name || "هامش للتجارة"}</span>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer shadow-2xs"
          >
            <Globe className="w-4 h-4 text-[#DDBB72] transition-transform group-hover:rotate-45" />
            <span>{language === "ar" ? "English" : "العربية"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl w-full">
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/60 p-6 sm:p-12 text-center relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DDBB72] via-[#E8CD8C] to-[#DDBB72]" />

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDBB72]/10 border border-[#DDBB72]/30 text-[#A67C2E] mb-6 shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DDBB72] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DDBB72]" />
              </span>
              <span className="text-xs sm:text-sm font-bold">
                {t("maintenance.badge")}
              </span>
            </div>

            {/* Visual Image / Icon */}
            <div className="mb-8 flex justify-center">
              {customImage ? (
                <div className="relative max-w-sm sm:max-w-md w-full rounded-2xl overflow-hidden border border-gray-100 bg-[#F9FAFB] p-4 shadow-sm">
                  <img
                    src={customImage}
                    alt="Maintenance"
                    className="w-full h-auto max-h-64 object-contain rounded-xl mx-auto"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#DDBB72]/20 via-[#DDBB72]/10 to-[#F9FAFB] border border-[#DDBB72]/30 flex items-center justify-center shadow-lg shadow-[#DDBB72]/15 mx-auto">
                    <Wrench className="w-12 h-12 sm:w-14 sm:h-14 text-[#DDBB72] animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 p-1.5 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Title & Message */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8 whitespace-pre-line">
              {message}
            </p>

            {/* Primary Action Button (Refresh) */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#DDBB72] hover:bg-[#CBA458] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#DDBB72]/30 hover:shadow-[#DDBB72]/45 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-75"
              >
                <RotateCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>{t("maintenance.refresh")}</span>
              </button>
            </div>

            {/* Quick Contact Options */}
            {maintenanceData?.show_contact !== false && contact && (
              <div className="pt-8 border-t border-gray-100">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-4">
                  {t("maintenance.contactUs")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] text-xs sm:text-sm font-bold transition-all duration-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t("maintenance.whatsapp")}</span>
                    </a>
                  )}

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-all duration-200"
                    >
                      <Phone className="w-4 h-4 text-[#DDBB72]" />
                      <span dir="ltr">{contact.phone}</span>
                    </a>
                  )}

                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-all duration-200"
                    >
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span>{contact.email}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-gray-500 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-4">
        <p>
          &copy; {new Date().getFullYear()} {settings?.site_name || "هامش للتجارة"}.{" "}
          {t("maintenance.allRightsReserved")}.
        </p>
        <span className="hidden sm:inline text-gray-300">•</span>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>{language === "ar" ? "تم التطوير بواسطة" : "Developed by"}</span>
          <a
            href="https://www.digitalplussa.com/ar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#DDBB72] hover:underline transition-colors"
          >
            {language === "ar" ? "شركة ديجيتال بلس" : "Digital Plus"}
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
      </footer>
    </div>
  );
}
