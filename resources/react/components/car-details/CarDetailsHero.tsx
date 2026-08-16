import { useTranslation } from "react-i18next";
import { Check, Scale } from "lucide-react";
import { formatPrice } from "../../utils/format";
import { useCarDetails } from "../../hooks/useCarDetails";
import type { ICarDetailsHeroProps } from "../../interfaces/ICarDetailsHeroProps";
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

    const {
        activeImage,
        setActiveImage,
        selectedColor,
        setSelectedColor,
        currentImage,
        isShowingColorImage,
        techSpecs,
        featuresToDisplay,
    } = useCarDetails({ images, specs, specifications, featuresList });

    return (
        <section dir={dir} className="w-full bg-[#F6F5F2] py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[820px_1fr] lg:gap-8 items-start">
                    {/* Gallery Card */}
                    <div className="order-1 overflow-hidden   border border-[#E8E7E3] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[407px]">
                        <CarDetailsGallery
                            title={title}
                            images={images}
                            currentImage={currentImage}
                            activeImage={activeImage}
                            onImageSelect={setActiveImage}
                            isShowingColorImage={isShowingColorImage}
                            selectedColor={selectedColor}
                            onClearColor={() => setSelectedColor(null)}
                        />
                    </div>

                    {/* Technical Specs Card */}
                    <div className="order-2 flex flex-col   border border-[#E8E7E3] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[407px]">
                        <h2 className="text-start text-[20px] font-bold text-[#111111] mb-5">
                            {t("carDetails.techSpecs.title")}
                        </h2>

                        <div className="grid grid-cols-2 text-start flex-1">
                            {techSpecs.map((spec, index) => {
                                const isLastRow = index >= techSpecs.length - 2;
                                const isRightCol = index % 2 === 1;
                                return (
                                    <div
                                        key={index}
                                        className={[
                                            "flex flex-col justify-center py-4",
                                            !isLastRow
                                                ? "border-b border-[#F0EFEA]"
                                                : "",
                                            !isRightCol
                                                ? "border-e border-[#F0EFEA] pe-6"
                                                : "ps-6",
                                        ].join(" ")}
                                    >
                                        <span className="text-[12px] font-medium text-[#999999] mb-1">
                                            {spec.label}
                                        </span>
                                        <span className="text-[20px] sm:text-[22px] font-black text-[#111111]">
                                            {spec.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info & Pricing Card */}
                    <div className="order-3 flex flex-col justify-between   border border-[#E8E7E3] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] self-start w-full">
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                {(brand || year) && (
                                    <span className="text-[13px] font-extrabold uppercase tracking-widest text-[#B59C5D]">
                                        {brand}
                                        {brand && year ? " · " : ""}
                                        {year}
                                    </span>
                                )}
                                {category && (
                                    <span className="rounded-[6px] bg-[#F2F4F7] px-3.5 py-1 text-[13px] font-semibold text-[#475467]">
                                        {category}
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 text-start text-[30px] sm:text-[30px] font-black leading-tight text-[#1A1F2E]">
                                {title}
                            </h1>
                        </div>

                        <div className="mt-8">
                            {/* Prices Row */}
                            <div className="mb-6 flex items-baseline justify-between gap-4">
                                <div className="text-start">
                                    <p className="text-[13px] font-medium text-[#777777]">
                                        {t("carDetails.hero.price")}
                                    </p>
                                    <p className="mt-1 text-[26px] sm:text-[29px] font-black text-[#111111]">
                                        {formatPrice(price, "#111111", lang)}
                                    </p>
                                </div>
                                <div className="text-start">
                                    <p className="text-[13px] font-medium text-[#777777]">
                                        {t("carDetails.hero.installmentFrom")}
                                    </p>
                                    <p className="mt-1 text-[22px] sm:text-[25px] font-extrabold text-[#DFA655]">
                                        {formatPrice(
                                            monthlyInstallment,
                                            "#DFA655",
                                            lang,
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={orderTo}
                                    className="flex h-[48px] flex-[1.4] items-center justify-center  bg-[#DFA655] px-4 text-[16px] font-bold text-white shadow-xs transition hover:bg-[#c89345] active:scale-95 cursor-pointer"
                                >
                                    {t("carDetails.actions.orderNow")}
                                </button>
                                <a
                                    href="/contact"
                                    className="flex h-[48px] flex-1 items-center justify-center  border border-[#D0D5DD] px-4 text-[16px] font-bold text-[#344054] transition hover:bg-gray-50 active:scale-95"
                                >
                                    {t("carDetails.actions.bookVisit")}
                                </a>
                                <a
                                    href="/compare"
                                    aria-label={t("carDetails.actions.compare")}
                                    className="flex h-[48px] w-[48px] shrink-0 items-center justify-center  border border-[#D0D5DD] text-[#344054] transition hover:bg-gray-50 active:scale-95"
                                >
                                    <Scale size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Features Card */}
                    <div className="order-4 flex flex-col justify-between   border border-[#E8E7E3] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <h2 className="text-start text-[20px] font-bold text-[#111111] mb-6">
                            {t("carDetails.features.title")}
                        </h2>

                        <div className="space-y-4 text-start">
                            {featuresToDisplay.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3"
                                >
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
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="mt-12">
                        <CarDetailsRecommendations
                            cars={recommendations}
                            maxItems={3}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
