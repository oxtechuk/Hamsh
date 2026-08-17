import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../store/language.store";
import { useSEO } from "../utils/useSEO";
import { getAboutPageData } from "../services/api";
import { APP_IMAGES } from "../constants/app-images";

import {
  FALLBACK_STATS,
  FALLBACK_TESTIMONIALS,
  FALLBACK_CORE_VALUES,
} from "../constants/about-data";

import type { IAboutData } from "../interfaces/IAboutData";
import type { IAboutStatViewModel } from "../interfaces/IAboutStatViewModel";
import type { IAboutTestimonialViewModel } from "../interfaces/IAboutTestimonialViewModel";
import type { IAboutCoreValueViewModel } from "../interfaces/IAboutCoreValueViewModel";

import AboutStatementSection from "../components/about/AboutStatementSection";
import AboutStatsSection from "../components/about/AboutStatsSection";
import AboutVisionSection from "../components/about/AboutVisionSection";
import AboutValuesSection from "../components/about/AboutValuesSection";
import AboutTestimonialsSection from "../components/about/AboutTestimonialsSection";

export default function AboutPage() {
  const { t } = useTranslation();

  const language = useLanguageStore((state) => state.language);
  const direction = useLanguageStore((state) => state.direction);

  useSEO(t("nav.about"), t("aboutPage.hero.description"));

  const { data: aboutData } = useQuery<IAboutData>({
    queryKey: ["about", language],
    queryFn: getAboutPageData,
  });

  const stats = useMemo<IAboutStatViewModel[]>(() => {
    const apiStats = aboutData?.about_stats ?? [];

    if (!apiStats.length) {
      return FALLBACK_STATS.map((stat) => ({
        ...stat,
        label: t(stat.label),
        description: t(stat.description),
      }));
    }

    return apiStats.slice(0, 4).map((stat, index) => ({
      id: index + 1,
      value: stat.value,
      label: stat.label,
      description: t(`aboutPage.stats.${index}.description`, ""),
    }));
  }, [aboutData, t]);

  const testimonials = useMemo<IAboutTestimonialViewModel[]>(() => {
    const apiTestimonials = aboutData?.testimonials ?? [];

    if (!apiTestimonials.length) {
      return FALLBACK_TESTIMONIALS.map((item) => ({
        ...item,
        quote: t(item.quote),
        customerName: t(item.customerName),
        customerCar: t(item.customerCar ?? ""),
      }));
    }

    return apiTestimonials.slice(0, 3).map((item) => ({
      id: item.id,
      quote: item.content,
      customerName: item.name,
      customerCar: item.job_title,
      rating: item.rating,
    }));
  }, [aboutData, t]);

  const coreValues = useMemo<IAboutCoreValueViewModel[]>(() => {
    const apiItems = aboutData?.core_values?.items ?? [];

    if (!apiItems.length) {
      return FALLBACK_CORE_VALUES.map((item) => ({
        ...item,
        title: t(item.title),
        description: t(item.description),
      }));
    }

    return apiItems.slice(0, 3).map((item, index) => ({
      id: item.title || index,
      title: item.title,
      description: item.description || "",
    }));
  }, [aboutData, t]);

  const quote =
    aboutData?.hero?.subtitle ||
    t("aboutPage.statement");

  const visionEyebrow = t("aboutPage.vision.eyebrow");
  const visionTitleLine1 = t("aboutPage.vision.titleLine1");
  const visionTitleHighlight = t("aboutPage.vision.titleHighlight");
  const visionTitleLine2 = t("aboutPage.vision.titleLine2");
  const visionDescription = t("aboutPage.vision.description");

  return (
    <main dir={direction} className="w-full bg-[var(--background)]">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[12px] sm:text-[13px]">
          <NavLink
            to="/"
            className="font-semibold text-[#303A54] transition hover:text-[var(--brand-primary-color)]"
          >
            {t("nav.home")}
          </NavLink>

          <ChevronLeft
            size={14}
            strokeWidth={1.6}
            className={[
              "text-[#6F7480]",
              direction === "ltr" ? "rotate-180" : "",
            ].join(" ")}
          />

          <span className="text-[var(--brand-primary-color)]">
            {t("nav.about")}
          </span>
        </nav>
      </div>

      <AboutStatementSection quote={quote} />

      <AboutStatsSection stats={stats} />

      <AboutVisionSection
        image={APP_IMAGES.ABOUT_VISION}
        eyebrow={visionEyebrow}
        titleLine1={visionTitleLine1}
        titleHighlight={visionTitleHighlight}
        titleLine2={visionTitleLine2}
        description={visionDescription}
      />

      <AboutTestimonialsSection
        title={t("aboutPage.testimonials.title")}
        testimonials={testimonials}
      />

      <AboutValuesSection values={coreValues} />
    </main>
  );
}
