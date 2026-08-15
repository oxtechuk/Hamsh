import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpLeft,
  Calculator,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../store/language.store";
import { getCarsMeta } from "../services/api";

import Button from "./button";
import LazyImg from "./LazyImg";
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

  autoPlayInterval = 5000,

  videoSrc,
  videoPoster,
  videoAutoPlay = true,
}: IHomeHeroProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore(
    (state) => state.direction,
  );

  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [finderOpen, setFinderOpen] =
    useState(false);

  const isRTL = direction === "rtl";

  const { data: meta } = useQuery({
    queryKey: ["cars-meta"],
    queryFn: getCarsMeta,
    staleTime: 5 * 60 * 1000,
    enabled: finderOpen,
  });

  const total = slides.length;
  const current = slides[index];

  const goTo = useCallback(
    (newIndex: number) => {
      if (!total) {
        return;
      }

      setIndex(
        ((newIndex % total) + total) % total,
      );
    },
    [total],
  );

  useEffect(() => {
    if (
      total <= 1 ||
      autoPlayInterval <= 0
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setIndex(
        (previousIndex) =>
          (previousIndex + 1) % total,
      );
    }, autoPlayInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoPlayInterval, total]);

  useEffect(() => {
    if (index >= total && total > 0) {
      setIndex(0);
    }
  }, [index, total]);

  const handleFinderSearch = (values: {
    brandId: string;
    typeId: string;
    categoryId: string;
    year: string;
    search: string;
  }) => {
    const params = new URLSearchParams();

    if (values.search) {
      params.set("q", values.search);
    }

    if (values.brandId) {
      params.set(
        "brands[]",
        values.brandId,
      );
    }

    if (values.typeId) {
      params.set("type", values.typeId);
    }

    if (values.categoryId) {
      params.set(
        "category_id",
        values.categoryId,
      );
    }

    if (values.year) {
      params.set("year", values.year);
    }

    navigate(`/cars?${params.toString()}`);
    setFinderOpen(false);
  };

  if (!current) {
    return null;
  }

  const resolvedTitlePrefix =
    titlePrefix ||
    t(
      "hero.titlePrefix",
      "امتلك سيارتك بثقة،",
    );

  const resolvedTitleHighlight =
    titleHighlight ||
    t(
      "hero.titleHighlight",
      "وتمويل يناسب طموحك.",
    );

  const resolvedDescription =
    description ||
    t(
      "hero.description2",
      "سيارات مختارة بعناية، مع حلول تمويل مرنة وخطوات واضحة.",
    );

  const resolvedVideo =
    videoSrc || "/videos/home-hero.mp4";

  return (
    <>
      <section
        dir={direction}
        className="w-full bg-[#FAF8F4] py-6 sm:py-8 lg:py-10"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div
            className={[
              "grid grid-cols-1 items-stretch gap-5",
              "lg:grid-cols-[1.08fr_0.92fr]",
              "lg:gap-7",
            ].join(" ")}
          >
            {/* Video */}
            <div
              className={[
                "relative min-h-[360px] overflow-hidden",
                "bg-[#E5E5E5]",
                "sm:min-h-[480px]",
                "lg:min-h-[610px]",
              ].join(" ")}
            >
              <video
                src={resolvedVideo}
                poster={videoPoster}
                autoPlay={videoAutoPlay}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-black/[0.03]" />
            </div>

            {/* Content and offer */}
            <div className="flex min-w-0 flex-col">
              {/* Heading */}
              <div className="text-start">
                <h1
                  className={[
                    "text-[38px] font-extrabold leading-[1.3]",
                    "text-[#171B29]",
                    "sm:text-[48px]",
                    "lg:text-[52px]",
                    "xl:text-[58px]",
                  ].join(" ")}
                >
                  <span className="block">
                    {resolvedTitlePrefix}
                  </span>

                  <span className="mt-2 block text-[#E3BF67]">
                    {resolvedTitleHighlight}
                  </span>
                </h1>

                {resolvedDescription && (
                  <p className="mt-5 max-w-[610px] text-[15px] leading-8 text-[#737373] sm:text-[17px]">
                    {resolvedDescription}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                  onClick={() =>
                    navigate("/cars")
                  }
                  bgColor="bg-[#E3BF67]"
                  textColor="text-[#171B29]"
                  className={[
                    "!h-[58px] !rounded-none",
                    "border border-[#E3BF67]",
                    "px-6 text-[16px] font-bold",
                    "shadow-none",
                    "hover:opacity-90",
                  ].join(" ")}
                >
                  {browseButtonText ||
                    t(
                      "hero.browseButton",
                      "استعرض السيارات",
                    )}
                </Button>

                <Button
                  to={calculatorButtonTo}
                  bgColor="bg-white"
                  textColor="text-[#171B29]"
                  className={[
                    "!h-[58px] !rounded-none",
                    "border border-[#D1D5DB]",
                    "px-6 text-[16px] font-bold",
                    "shadow-none",
                    "hover:bg-[#F7F7F7]!",
                  ].join(" ")}
                >
                  <Calculator
                    size={19}
                    strokeWidth={1.8}
                  />

                  {calculatorButtonText ||
                    t(
                      "hero.calculatorButton",
                      "احسب تمويلك",
                    )}
                </Button>
              </div>

              {/* Offer image */}
              <article
                className={[
                  "group relative mt-6 min-h-[300px] flex-1 overflow-hidden",
                  "bg-[#E7E7E7]",
                  "sm:min-h-[340px]",
                  "lg:min-h-[380px]",
                ].join(" ")}
              >
                <LazyImg
                  key={current.id}
                  src={current.image}
                  alt={
                    current.alt ||
                    resolvedTitlePrefix
                  }
                  className={[
                    "absolute inset-0 h-full w-full object-cover",
                    "transition duration-700",
                    "group-hover:scale-[1.02]",
                  ].join(" ")}
                />

                {/* Offer link */}
                {current.detailsTo && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        current.detailsTo!,
                      )
                    }
                    className={[
                      "absolute bottom-0 start-0 z-20",
                      "flex h-[58px] min-w-[205px]",
                      "items-center justify-center gap-3",
                      "bg-white px-6",
                      "text-[16px] font-bold text-[#171B29]",
                      "transition hover:bg-[#F4F4F4]",
                    ].join(" ")}
                  >
                    <ArrowUpLeft
                      size={21}
                      strokeWidth={1.7}
                      className={
                        isRTL
                          ? ""
                          : "rotate-90"
                      }
                    />

                    {t(
                      "hero.offerButton",
                      "اطلع على العرض",
                    )}
                  </button>
                )}

                {/* Slider dots */}
                {total > 1 && (
                  <div
                    dir="ltr"
                    className="absolute bottom-5 end-5 z-20 flex items-center gap-2"
                  >
                    {slides.map(
                      (slide, slideIndex) => (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() =>
                            goTo(slideIndex)
                          }
                          aria-label={`${t(
                            "hero.slider.goTo",
                            "الانتقال إلى العرض",
                          )} ${slideIndex + 1}`}
                          className={[
                            "h-[6px] rounded-full",
                            "transition-all duration-300",
                            slideIndex === index
                              ? "w-[36px] bg-white"
                              : "w-[12px] bg-white/50",
                          ].join(" ")}
                        />
                      ),
                    )}
                  </div>
                )}
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Car finder modal */}
      {finderOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          onClick={() =>
            setFinderOpen(false)
          }
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className="relative z-10 w-full bg-[var(--brand-primary-color)] shadow-[0_8px_40px_rgba(0,0,0,0.2)]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() =>
                setFinderOpen(false)
              }
              className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label={t(
                "common.close",
                "إغلاق",
              )}
            >
              <X size={18} />
            </button>

            <CarFinder
              brands={
                meta?.filter_brands ?? []
              }
              types={
                meta?.filter_types ?? []
              }
              categories={
                meta?.filter_categories ??
                []
              }
              years={
                meta?.filter_years ?? []
              }
              onSearch={handleFinderSearch}
              onReset={() =>
                setFinderOpen(false)
              }
            />
          </div>
        </div>
      )}
    </>
  );
}