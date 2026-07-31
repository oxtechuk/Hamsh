import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import CompareTable from "../components/compare/CompareTable";
import CompareSummary from "../components/compare/CompareSummary";
import CompareCarSlot from "../components/compare/CompareCarSlot";
import { useSEO } from "../utils/useSEO";
import { localize } from "../utils/localize";
import { getCarBySlug, compareCars } from "../services/api/cars.service";
import { useLanguageStore } from "../store/language.store";

export default function ComparePage() {
  const { t, i18n } = useTranslation();
  useSEO(t("pageTitles.compare"), t("comparePage.compareDescription"));
  const language = useLanguageStore((s) => s.language);
  const [searchParams] = useSearchParams();
  const initialSlug = searchParams.get("slug") || "";

  const [car1Slug, setCar1Slug] = useState(initialSlug);
  const [car2Slug, setCar2Slug] = useState("");

  const [showSearch1, setShowSearch1] = useState(!initialSlug);
  const [showSearch2, setShowSearch2] = useState(false);

  const { data: car1, isLoading: isLoading1 } = useQuery({
    queryKey: ["compare-car1", car1Slug],
    queryFn: () => getCarBySlug(car1Slug),
    enabled: !!car1Slug,
  });

  const { data: car2, isLoading: isLoading2 } = useQuery({
    queryKey: ["compare-car2", car2Slug],
    queryFn: () => getCarBySlug(car2Slug),
    enabled: !!car2Slug,
  });

  const { data: compareData } = useQuery({
    queryKey: ["compare-result", car1Slug, car2Slug],
    queryFn: () => compareCars([car1Slug, car2Slug]),
    enabled: !!car1Slug && !!car2Slug,
  });

  const dir = i18n.dir();
  const car1Name = car1 ? localize(car1.name, language) : "";
  const car2Name = car2 ? localize(car2.name, language) : "";

  return (
    <div dir={dir} className="min-h-screen overflow-x-hidden bg-[#f3f6fa]">
      <div className="relative z-20 mt-[80px] px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-[minmax(280px,380px)_1fr_minmax(280px,380px)] items-start gap-12 max-lg:grid-cols-1 max-lg:max-w-[460px] max-lg:mx-auto max-lg:gap-7">
            {/* Car 1 slot */}
            <div className="max-lg:order-1">
              <CompareCarSlot
                slug={car1Slug}
                car={car1}
                isLoading={isLoading1}
                showSearch={showSearch1}
                label={t("comparePage.carOne")}
                dir={dir}
                onSelect={(slug) => {
                  setCar1Slug(slug);
                  setShowSearch1(false);
                }}
                onRemove={() => {
                  setCar1Slug("");
                  setShowSearch1(true);
                }}
                onShowSearch={() => setShowSearch1(true)}
                onHideSearch={() => setShowSearch1(false)}
              />
            </div>

            {/* VS divider */}
            <div className="relative flex min-h-[390px] items-center justify-center max-lg:order-2 max-lg:min-h-[130px]">
              {/* Diagonal faded line */}
              <div
                aria-hidden="true"
                className={[
                  "absolute start-1/2 top-1/2",
                  "h-[360px] w-px",
                  "-translate-x-1/2 -translate-y-1/2",
                  "rotate-[20deg]",
                  "bg-gradient-to-b",
                  "from-transparent",
                  "via-[#C9232C]/45",
                  "to-transparent",
                  "max-lg:h-[170px]",
                  "max-lg:rotate-90",
                ].join(" ")}
              />

              {/* VS circle */}
              <div
                className={[
                  "relative z-10",
                  "flex h-[54px] w-[54px]",
                  "items-center justify-center",
                  "rounded-full border-2 border-[#C9232C]",
                  "bg-white",
                  "text-[16px] font-black uppercase",
                  "text-[#C9232C]",
                  "shadow-[0_4px_14px_rgba(201,35,44,0.08)]",
                ].join(" ")}
              >
                {t("comparePage.vs")}
              </div>
            </div>

            {/* Car 2 slot */}
            <div className="max-lg:order-3">
              <CompareCarSlot
                slug={car2Slug}
                car={car2}
                isLoading={isLoading2}
                showSearch={showSearch2}
                label={t("comparePage.carTwo")}
                dir={dir}
                onSelect={(slug) => {
                  setCar2Slug(slug);
                  setShowSearch2(false);
                }}
                onRemove={() => {
                  setCar2Slug("");
                  setShowSearch2(true);
                }}
                onShowSearch={() => setShowSearch2(true)}
                onHideSearch={() => setShowSearch2(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {car1Slug &&
        car2Slug &&
        compareData &&
        compareData.length > 0 &&
        car1 &&
        car2 && (
          <>
            <div className="mx-auto max-w-7xl px-6 pb-16">
              <CompareTable
                sections={compareData}
                car1Name={car1Name}
                car2Name={car2Name}
              />
            </div>
            <CompareSummary
              sections={compareData}
              car1Name={car1Name}
              car2Name={car2Name}
              car1Slug={car1Slug}
              car2Slug={car2Slug}
            />
          </>
        )}
    </div>
  );
}
