import type { ReactNode } from "react";
import { APP_IMAGES } from "../constants/app-images";

export function fmt(v: number): string {
  return Number.isFinite(v) ? Math.round(v).toLocaleString() : "0";
}

export function formatPrice(price: number | string, riyalColor: string, locale?: string): ReactNode {
  const resolvedLocale = locale === "ar" ? "ar-SA" : "en-US";
  const num = typeof price === "number" ? price : parseFloat(String(price)) || 0;
  const formatted = num.toLocaleString(resolvedLocale);

  return (
    <span
      className="inline-flex items-center gap-1 align-middle"
      style={{ color: riyalColor }}
    >
      <span className="align-middle">{formatted}</span>

      <span
        aria-label="ريال"
        className="inline-block h-[18px] w-[18px] shrink-0 align-middle"
        style={{
          backgroundColor: riyalColor,
          WebkitMask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
          mask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
        }}
      />
    </span>
  );
}
