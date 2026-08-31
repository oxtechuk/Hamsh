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
      className="min-h-screen relative flex flex-col justify-between bg-[#0b0f19] text-white selection:bg-[#EB5E28] selection:text-white font-sans overflow-hidden"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#EB5E28]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#EB5E28]/10 via-transparent to-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt={settings?.site_name || "Logo"}
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
            />
          ) : (
            <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EB5E28] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#EB5E28]/20">
                <Wrench className="w-5 h-5" />
              </span>
              <span>{settings?.site_name || "Auto Store"}</span>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300 text-sm font-medium text-gray-200 hover:text-white"
        >
          <Globe className="w-4 h-4 text-[#EB5E28] transition-transform group-hover:rotate-45" />
          <span>{language === "ar" ? "English" : "العربية"}</span>
        </button>
      </header>

      {/* Main Content Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB5E28] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EB5E28]" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-gray-300">
              {t("maintenance.badge")}
            </span>
          </div>

          {/* Maintenance Visual (Image or Custom Illustration) */}
          <div className="relative mb-8 flex justify-center">
            {customImage ? (
              <div className="relative group max-w-sm sm:max-w-md w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#EB5E28]/30 to-amber-500/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl p-3 shadow-2xl">
                  <img
                    src={customImage}
                    alt="Maintenance Mode"
                    className="w-full h-auto max-h-72 object-contain rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#EB5E28]/20 via-[#EB5E28]/10 to-transparent border border-[#EB5E28]/30 flex items-center justify-center shadow-2xl shadow-[#EB5E28]/20 backdrop-blur-xl mx-auto">
                  <Wrench className="w-14 h-14 sm:w-16 sm:h-16 text-[#EB5E28] animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {title}
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8 whitespace-pre-line">
            {message}
          </p>

          {/* Refresh Action Button */}
          <div className="flex justify-center mb-10">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#EB5E28] to-[#d64b18] hover:from-[#f06834] hover:to-[#e05420] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#EB5E28]/25 hover:shadow-[#EB5E28]/40 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-75"
            >
              <RotateCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{t("maintenance.refresh")}</span>
            </button>
          </div>

          {/* Optional Quick Contact Info */}
          {maintenanceData?.show_contact !== false && contact && (
            <div className="pt-8 border-t border-white/10">
              <p className="text-xs sm:text-sm text-gray-400 mb-4 font-medium">
                {t("maintenance.contactUs")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs sm:text-sm font-medium transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t("maintenance.whatsapp")}</span>
                  </a>
                )}

                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 text-[#EB5E28]" />
                    <span dir="ltr">{contact.phone}</span>
                  </a>
                )}

                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200"
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>{contact.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-gray-500 border-t border-white/5">
        <p>
          &copy; {new Date().getFullYear()} {settings?.site_name || ""}.{" "}
          {t("maintenance.allRightsReserved")}.
        </p>
      </footer>
    </div>
  );
}
