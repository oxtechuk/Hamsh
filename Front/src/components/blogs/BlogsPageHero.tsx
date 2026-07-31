import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { IBlogsPageHeroProps } from "../../interfaces/IBlogsPageHeroProps";
import { useLanguageStore } from "../../store/language.store";

export default function BlogsPageHero({
  title,
  description,
}: IBlogsPageHeroProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((state) => state.direction);

  const isRTL = direction === "rtl";

  return (
    <section
      dir={direction}
      className="w-full py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "flex flex-col gap-8",
            "lg:flex-row lg:items-end lg:justify-between",
          ].join(" ")}
        >
          {/* Title area */}
          <div className="text-start lg:max-w-[560px]">
            <nav
              aria-label={t("common.breadcrumb", "Breadcrumb")}
              className="flex items-center gap-2 text-[13px]"
            >
              <NavLink
                to="/"
                className="text-[#6E6E73] transition-colors hover:text-[#C5232B]"
              >
                {t("nav.home")}
              </NavLink>

              <ChevronLeft
                size={15}
                strokeWidth={1.8}
                className={[
                  "text-[#8C8C91]",
                  !isRTL ? "rotate-180" : "",
                ].join(" ")}
              />

              <span className="font-medium text-[#C5232B]">
                {t("nav.blog")}
              </span>
            </nav>

            <h1
              className={[
                "mt-5 leading-[1.15] font-bold",
                "text-[var(--brand-secondary-color)]",
                "sm:text-[42px] lg:text-[48px]",
              ].join(" ")}
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />

            {description && (
              <p className="mt-3 pt-5 max-w-[600px] text-[15px] leading-7 text-[#E37D80] sm:text-[16px]">
                {description}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
