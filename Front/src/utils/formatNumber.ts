import i18n from "../i18n";

export function formatNumber(value: number, locale?: string): string {
  const lang = locale ?? i18n.language ?? "ar";
  const resolvedLocale = lang.startsWith("ar") ? "ar-SA" : "en-US";
  return value.toLocaleString(resolvedLocale);
}
