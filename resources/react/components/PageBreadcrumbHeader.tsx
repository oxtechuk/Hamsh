import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IPageBreadcrumbHeaderProps } from "../interfaces/IPageBreadcrumbHeaderProps";

export type { IBreadcrumbItem } from "../interfaces/IPageBreadcrumbHeaderProps";

export default function PageBreadcrumbHeader({
  title,
  breadcrumbs = [],
  className = "",
}: IPageBreadcrumbHeaderProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <section dir={i18n.dir()} className={`w-full py-8 sm:py-10 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={isRtl ? "text-right" : "text-left"}>
          <nav
            aria-label={t("common.breadcrumb", "Breadcrumb")}
            className="flex flex-wrap items-center gap-2 text-[13px]"
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-2"
                >
                  {item.to && !isLast ? (
                    <NavLink
                      to={item.to}
                      className="text-[#77777D] transition-colors hover:text-[var(--brand-secondary-color)]"
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <span
                      className={
                        isLast
                          ? "font-medium text-[var(--brand-secondary-color)]"
                          : "text-[#77777D]"
                      }
                    >
                      {item.label}
                    </span>
                  )}

                  {!isLast && (
                    <ChevronLeft
                      size={14}
                      strokeWidth={1.8}
                      className={[
                        "text-[#8D8D92]",
                        !isRtl ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <h1
            className={[
              "mt-4 text-[32px] font-extrabold leading-tight",
              "text-[var(--brand-secondary-color)]",
              "sm:text-[38px] lg:text-[42px]",
            ].join(" ")}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
