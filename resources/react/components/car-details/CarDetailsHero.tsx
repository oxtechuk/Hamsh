import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Check, Scale } from "lucide-react";
import { formatPrice } from "../../utils/format";
import type {
  ICarColor,
  ICarDetailsHeroProps,
} from "../../interfaces/ICarDetailsHeroProps";
import CarDetailsGallery from "./CarDetailsGallery";
import CarDetailsRecommendations from "../CarDetailsRecommendations";

export default function CarDetailsHero({
  title,
  images,
  price,
  monthlyInstallment,
  orderTo,
  brand,
  year,
  category,
  specs,
  specifications = [],
  featuresList = [],
  recommendations = [],
}: ICarDetailsHeroProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const lang = i18n.language;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ICarColor | null>(null);

  const allImages = images;
  const colorImage = selectedColor?.image ?? null;
  const currentImage = colorImage ?? allImages[activeImage] ?? "";
  const isShowingColorImage = !!colorImage;

  // Build Technical Specifications list (2 columns x 3 rows) matching exact reference image
  const getSpec = (key: string, fallback: string) => {
    if (specs && specs[key]) return String(specs[key]);
    const found = specifications.find(
      (s) => s.name.toLowerCase().includes(key.toLowerCase()) || (s.value && s.name.includes(key))
    );
    return found?.value || found?.name || fallback;
  };

  const techSpecs = [
    {
      label: t("carDetails.specs.power", "الطاقة"),
      value: getSpec("horsepower", "415 حصان"),
    },
    {
      label: t("carDetails.specs.fuel", "الوقود"),
      value: getSpec("fuel", "بنزين"),
    },
    {
      label: t("carDetails.specs.capacity", "السعة"),
      value: getSpec("capacity", "4 VIP"),
    },
    {
      label: t("carDetails.specs.maxSpeed", "السرعة القصوى"),
      value: getSpec("speed", "250 كم/س"),
    },
    {
      label: t("carDetails.specs.warranty", "الضمان"),
      value: getSpec("warranty", "4 سنوات"),
    },
    {
      label: t("carDetails.specs.transmission", "ناقل الحركة"),
      value: getSpec("transmission", "أوتوماتيك"),
    },
  ];

  // Build Features & Equipment list matching reference image
  const featuresToDisplay =
    featuresList.length > 0
      ? featuresList.map((f) => (typeof f === "string" ? f : f.name))
      : [
          "نظام MBUX Hyperscreen 56 بوصة",
          "مقاعد Nappa بـ 10 اتجاهات",
          "محرك V6 Biturbo 3.0L",
          "شمس الأمامية الزجاجية الكاملة",
          "مدير مسار Distronic Plus",
          "نظام رؤية ليلية",
        ];

  return (
    <section dir={dir} className="w-full bg-[#F6F5F2] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2x2 Grid Layout matching user's design */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-stretch">
          
          {/* ============================================================ */}
          {/* CARD 1: Gallery Carousel (Top-Right in RTL)                  */}
          {/* ============================================================ */}
          <div className="order-1 flex flex-col justify-between rounded-[20px] border border-[#E8E7E3] bg-white p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-h-[380px] sm:min-h-[440px]">
            <CarDetailsGallery
              title={title}
              images={allImages}
              currentImage={currentImage}
              activeImage={activeImage}
              onImageSelect={setActiveImage}
              isShowingColorImage={isShowingColorImage}
              selectedColor={selectedColor}
              onClearColor={() => setSelectedColor(null)}
            />
          </div>

          {/* ============================================================ */}
          {/* CARD 2: Technical Specifications (Top-Left in RTL)            */}
          {/* ============================================================ */}
          <div className="order-2 flex flex-col justify-between rounded-[20px] border border-[#E8E7E3] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h2 className="text-start text-[20px] font-bold text-[#111111] mb-6">
              {t("carDetails.specs.title", "المواصفات التقنية")}
            </h2>

            {/* 2-Column x 3-Row Grid with Dividers */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 divide-y-0 text-start">
              {techSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center border-b border-[#F0EFEA] pb-4 last:border-b-0"
                >
                  <span className="text-[13px] font-medium text-[#888888] mb-1">
                    {spec.label}
                  </span>
                  <span className="text-[20px] sm:text-[23px] font-black text-[#111111]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* CARD 3: Features & Equipment (Bottom-Left in RTL)            */}
          {/* ============================================================ */}
          <div className="order-4 lg:order-3 flex flex-col justify-between rounded-[20px] border border-[#E8E7E3] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h2 className="text-start text-[20px] font-bold text-[#111111] mb-6">
              {t("carDetails.features.title", "المميزات والتجهيزات")}
            </h2>

            <div className="space-y-4 text-start">
              {featuresToDisplay.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FCE8B8] bg-[#FFF9EB] text-[#DFA655]">
                    <Check size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[15px] font-bold text-[#222222]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* CARD 4: Car Info, Price & Actions (Bottom-Right in RTL)       */}
          {/* ============================================================ */}
          <div className="order-3 lg:order-4 flex flex-col justify-between rounded-[20px] border border-[#E8E7E3] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div>
              {/* Header Badge & Brand/Year */}
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-[6px] bg-[#F2F4F7] px-3.5 py-1 text-[13px] font-semibold text-[#475467]">
                  {category || t("carDetails.hero.defaultCategory", "سيدان")}
                </span>

                {(brand || year) && (
                  <span className="text-[13px] font-extrabold uppercase tracking-widest text-[#B59C5D]">
                    {brand} {brand && year ? " · " : ""} {year}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mt-4 text-start text-[28px] sm:text-[34px] font-black leading-tight text-[#111111]">
                {title}
              </h1>
            </div>

            <div className="mt-8">
              {/* Prices Row */}
              <div className="mb-6 flex items-baseline justify-between gap-4">
                {/* Monthly Installment */}
                <div className="text-start">
                  <p className="text-[13px] font-medium text-[#777777]">
                    {t("carDetails.hero.installmentFrom", "قسط شهري يبدأ من")}
                  </p>
                  <p className="mt-1 text-[22px] sm:text-[25px] font-extrabold text-[#DFA655]">
                    {formatPrice(monthlyInstallment, "#DFA655", lang)}
                  </p>
                </div>

                {/* Cash Price */}
                <div className="text-end">
                  <p className="text-[13px] font-medium text-[#777777]">
                    {t("carDetails.hero.price", "السعر النقدي")}
                  </p>
                  <p className="mt-1 text-[26px] sm:text-[29px] font-black text-[#111111]">
                    {formatPrice(price, "#111111", lang)}
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3">
                {/* Compare Button */}
                <a
                  href="/compare"
                  aria-label={t("carDetails.hero.compare", "مقارنة")}
                  className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[8px] border border-[#D0D5DD] text-[#344054] transition hover:bg-gray-50 active:scale-95"
                >
                  <Scale size={20} />
                </a>

                {/* Visit / Book Button */}
                <a
                  href="/contact"
                  className="flex h-[48px] flex-1 items-center justify-center rounded-[8px] border border-[#D0D5DD] px-4 text-[16px] font-bold text-[#344054] transition hover:bg-gray-50 active:scale-95"
                >
                  {t("carDetails.hero.bookVisit", "احجز زيارة")}
                </a>

                {/* Main Golden Order Button */}
                <button
                  type="button"
                  onClick={orderTo}
                  className="flex h-[48px] flex-[1.4] items-center justify-center rounded-[8px] bg-[#DFA655] px-4 text-[16px] font-bold text-white shadow-xs transition hover:bg-[#c89345] active:scale-95 cursor-pointer"
                >
                  {t("carDetails.hero.orderNow", "اطلب التمويل")}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <CarDetailsRecommendations cars={recommendations} maxItems={3} />
          </div>
        )}
      </div>
    </section>
  );
}
