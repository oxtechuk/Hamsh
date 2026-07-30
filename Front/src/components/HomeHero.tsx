import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calculator, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../store/language.store";
import { getCarsMeta } from "../services/api";

import Button from "./button";
import LazyImg from "./LazyImg";
import SlideArrow from "./SlideArrow";
import CarFinder from "./CarFinder";

import type { IHomeHeroProps } from "../interfaces/IHomeHeroProps";

export type { IHomeHeroSlide } from "../interfaces/IHomeHeroSlide";

export default function HomeHero({
  slides,

  titlePrefix,
  titleHighlight,
  titleLine2,
  titleLine2Prefix,
  titleLine2Highlight,

  description,

  calculatorButtonText,
  calculatorButtonTo = "/finance-calculator",

  browseButtonText,

  stats,
  autoPlayInterval = 5000,
}: IHomeHeroProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((state) => state.direction);
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [finderOpen, setFinderOpen] = useState(false);

  const { data: meta } = useQuery({
    queryKey: ["cars-meta"],
    queryFn: getCarsMeta,
    staleTime: 5 * 60 * 1000,
    enabled: finderOpen,
  });

  const handleFinderSearch = (values: {
    brandId: string;
    typeId: string;
    categoryId: string;
    year: string;
    search: string;
  }) => {
    const params = new URLSearchParams();
    if (values.search) params.set("q", values.search);
    if (values.brandId) params.set("brands[]", values.brandId);
    if (values.typeId) params.set("type", values.typeId);
    if (values.categoryId) params.set("category_id", values.categoryId);
    if (values.year) params.set("year", values.year);
    navigate(`/cars?${params.toString()}`);
    setFinderOpen(false);
  };

  const total = slides.length;
  const current = slides[index];

  const goTo = useCallback(
    (newIndex: number) => {
      if (!total) return;

      setIndex(((newIndex % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const previous = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (total <= 1 || autoPlayInterval <= 0) return;

    const intervalId = window.setInterval(() => {
      setIndex((previousIndex) => (previousIndex + 1) % total);
    }, autoPlayInterval);

    return () => window.clearInterval(intervalId);
  }, [autoPlayInterval, total]);

  useEffect(() => {
    if (index >= total && total > 0) {
      setIndex(0);
    }
  }, [index, total]);

  if (!current) return null;

  const defaultStats = [
    {
      value: "98%",
      label: t("hero.stats.satisfaction", "رضا العملاء"),
    },
    {
      value: t("hero.stats.yearsValue", "6 سنين"),
      label: t("hero.stats.years", "خبرة في السوق"),
    },
    {
      value: "+320",
      label: t("hero.stats.cars", "سيارة متوفرة"),
    },
  ];

  const resolvedStats = stats?.length ? stats : defaultStats;

  const resolvedTitlePrefix = titlePrefix || t("hero.titlePrefix", "اختر");

  const resolvedTitleHighlight =
    titleHighlight || t("hero.titleHighlight", "سيارتك");

  const resolvedTitleLine2Prefix =
    titleLine2Prefix || titleLine2 || t("hero.titleLine2Prefix", "بطريقة");

  const resolvedTitleLine2Highlight =
    titleLine2Highlight ||
    (titleLine2 ? "" : t("hero.titleLine2Highlight", "تليق فيك"));

  const resolvedDescription =
    description ||
    t(
      "hero.description2",
      "مجموعة مختارة بعناية من أفخم السيارات، مع تمويل مرن يوصلك لسيارتك بأقل خطوات وأوضح شروط.",
    );

  return (
    <>
    <section
      dir={direction}
      className="w-full overflow-hidden  py-10 sm:py-14 lg:min-h-[680px] lg:py-16"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-20 xl:gap-28">
          {/* Hero content */}
          <div className="order-2 text-center lg:order-1 lg:text-start">
            {/* First heading line */}
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="text-[44px] font-black leading-none tracking-[-2px] text-[#060709] sm:text-[58px] xl:text-[72px]">
                {resolvedTitlePrefix}
              </span>

              <span className="inline-flex -rotate-[4deg] items-center justify-center rounded-[18px] bg-[var(--brand-secondary-color)]! px-5 pb-3 pt-1 text-[43px] font-black leading-none tracking-[-2px] text-white shadow-[0_10px_25px_rgba(180,34,37,0.18)] sm:px-7 sm:text-[57px] xl:text-[70px]">
                {resolvedTitleHighlight}
              </span>
            </div>

            {/* Second heading line */}
            <h1 className="mt-5 text-[41px] font-black leading-[1.2] tracking-[-2px] text-[#060709] sm:text-[56px] xl:text-[70px]">
              <span>{resolvedTitleLine2Prefix}</span>

              {resolvedTitleLine2Highlight && (
                <>
                  {" "}
                  <span className="text-[var(--brand-secondary-color)]">
                    {resolvedTitleLine2Highlight}
                  </span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-7 pt-4 max-w-[610px] text-[15px] font-medium leading-[2] text-[#676767] sm:text-[17px] lg:mx-0">
              {resolvedDescription}
            </p>

            {/* Buttons */}
            <div
              dir="ltr"
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <Button
                to={calculatorButtonTo}
                bgColor="bg-[#060709]"
                className="h-[56px] w-full gap-3 rounded-[5px]! px-6 text-[15px] font-extrabold hover:bg-[#2E3035]!"
              >
                <Calculator size={21} strokeWidth={1.8} />

                <span dir={direction}>
                  {calculatorButtonText ||
                    t("hero.calculatorButton", "احسب قسطك")}
                </span>
              </Button>

              <Button
                bgColor="bg-[var(--brand-secondary-color)]"
                className="h-[56px] w-full gap-3 rounded-[5px]! px-6 text-[15px] font-extrabold hover:opacity-90!"
                onClick={(e) => { e?.preventDefault?.(); setFinderOpen(true); }}
              >
                <ArrowLeft size={22} strokeWidth={1.8} />

                <span dir={direction}>
                  {browseButtonText ||
                    t("hero.browseButton", "استعرض السيارات")}
                </span>
              </Button>
            </div>

            {/* Statistics */}
            <div
              dir="ltr"
              className="mt-8 grid grid-cols-4 border-t border-[#E4E2DF] pt-7"
            >
              {resolvedStats.map((stat, statIndex) => (
                <div
                  key={`${stat.value}-${statIndex}`}
                  dir={direction}
                  className={`px-2 text-center sm:px-5 ${
                    statIndex > 0 ? "border-l border-[#E4E2DF]" : ""
                  }`}
                >
                  <strong className="block text-[23px] font-black leading-tight text-[#060709] sm:text-[28px]">
                    {stat.value}
                  </strong>

                  <span className="mt-2 block text-[11px] font-medium text-[#676767] sm:text-[13px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Car showcase */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto lg:mx-0">
              <article className="relative h-[470px] overflow-hidden rounded-[24px] bg-[#050608] shadow-[0_22px_55px_rgba(15,23,42,0.14)] sm:h-[520px]">
                {/* Car image */}
                <LazyImg
                  key={current.id}
                  src={current.image}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                />
              </article>

              {/* Slider controls */}
              {total > 1 && (
                <div
                  dir="ltr"
                  className="mt-4 flex items-center justify-center gap-4"
                >
                  <SlideArrow
                    direction="prev"
                    onClick={previous}
                    aria-label={t("hero.slider.previous", "السيارة السابقة")}
                    className="h-10! w-10! rounded-[5px]! border-[var(--brand-secondary-color)]! bg-transparent! text-[var(--brand-secondary-color)]! shadow-none!"
                  />

                  <div className="flex items-center gap-2">
                    {slides.map((slide, slideIndex) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => goTo(slideIndex)}
                        aria-label={`${t(
                          "hero.slider.goTo",
                          "الانتقال إلى السيارة",
                        )} ${slideIndex + 1}`}
                        aria-current={slideIndex === index ? "true" : undefined}
                        className={`h-[7px] rounded-full border-0 transition-all duration-300 ${
                          slideIndex === index
                            ? "w-[58px] bg-[var(--brand-secondary-color)]"
                            : "w-[20px] bg-[#C7C8CA]"
                        }`}
                      />
                    ))}
                  </div>

                  <SlideArrow
                    direction="next"
                    onClick={next}
                    aria-label={t("hero.slider.next", "السيارة التالية")}
                    className="h-10! w-10! rounded-[5px]! border-[var(--brand-secondary-color)]! bg-transparent! text-[var(--brand-secondary-color)]! shadow-none!"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* CarFinder modal */}
      {finderOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          onClick={() => setFinderOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full bg-[var(--brand-primary-color)] shadow-[0_8px_40px_rgba(0,0,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFinderOpen(false)}
              className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label={t("common.close", "إغلاق")}
            >
              <X size={18} />
            </button>
            <CarFinder
              brands={meta?.filter_brands ?? []}
              types={meta?.filter_types ?? []}
              categories={meta?.filter_categories ?? []}
              years={meta?.filter_years ?? []}
              onSearch={handleFinderSearch}
              onReset={() => setFinderOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
