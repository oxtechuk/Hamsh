import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { IBlogsPageHeroProps } from "../../interfaces/IBlogsPageHeroProps";
import { useLanguageStore } from "../../store/language.store";

export default function BlogsPageHero({
  title,
  description,
  categories,
  activeCategory,
  onCategoryChange,
}: IBlogsPageHeroProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((state) => state.direction);

  const isRTL = direction === "rtl";

  return (
    <section
      dir={direction}
      className="w-full py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
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
                "mt-5 text-[34px] font-extrabold leading-[1.15]",
                "text-[#C5232B]",
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

          {/* Categories */}
          {categories.length > 0 && (
            <div
              className={[
                "flex flex-wrap items-center gap-2.5",
                isRTL
                  ? "justify-start lg:justify-end"
                  : "justify-start",
              ].join(" ")}
            >
              {categories.map((category) => {
                const isActive =
                  category.value === activeCategory;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() =>
                      onCategoryChange?.(category.value)
                    }
                    className={[
                      "flex min-h-[38px] items-center justify-center",
                      "rounded-[4px] px-5",
                      "text-[13px] font-bold",
                      "transition duration-300",
                      isActive
                        ? [
                            "bg-[#C5232B]",
                            "text-white",
                            "shadow-[0_5px_14px_rgba(197,35,43,0.14)]",
                          ].join(" ")
                        : [
                            "bg-[#F2F2F2]",
                            "text-[#858589]",
                            "hover:bg-[#E8E8E8]",
                            "hover:text-[#C5232B]",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
