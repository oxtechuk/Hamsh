import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

import CarOrderModal from "./CarOrderModal";
import CarDetailsModalGallery from "./car-details/CarDetailsModalGallery";
import CarDetailsInfoPanel from "./car-details/CarDetailsInfoPanel";
import { useCarDetailsModal } from "../hooks/useCarDetailsModal";
import { useLanguageStore } from "../store/language.store";

import type { ICarDetailsModalProps } from "../interfaces/ICarDetailsModalProps";

export default function CarDetailsModal({
    slug,
    onClose,
}: ICarDetailsModalProps) {
    const { t } = useTranslation();
    const direction = useLanguageStore((state) => state.direction);

    const {
        car,
        rawCar,
        selectedTrim,
        selectedTrimIndex,
        handleSelectTrim,
        isLoading,
        activeImage,
        setActiveImage,
        activeTab,
        setActiveTab,
        showOrderModal,
        orderMode,
        specRows,
        featureRows,
        images,
        badge,
        handlePrev,
        handleNext,
        handleOrder,
        handleFinance,
        handleCompare,
    } = useCarDetailsModal(slug, onClose);

    if (showOrderModal && car) {
        return <CarOrderModal car={car} initialMode={orderMode} onClose={onClose} />;
    }

    return createPortal(
        <div
            dir={direction}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[1100px]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t("common.close")}
                    className="absolute end-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#20283A] shadow-md backdrop-blur-sm transition hover:bg-[#F0EEE8] sm:start-0 sm:end-auto sm:-top-12 sm:bg-white sm:backdrop-blur-none"
                >
                    <X size={18} />
                </button>

                <div className="h-dvh max-h-dvh w-full overflow-y-auto bg-[#FAF8F4] shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:h-auto sm:max-h-[90vh]">
                    {isLoading || !car ? (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--brand-primary-color)] border-t-transparent" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <CarDetailsInfoPanel
                                car={car}
                                selectedTrimIndex={selectedTrimIndex}
                                onSelectTrimIndex={handleSelectTrim}
                                featureRows={featureRows}
                                onOrder={() => handleOrder("cash")}
                                onFinance={() => handleOrder("finance")}
                            />

                            <CarDetailsModalGallery
                                car={car}
                                images={images}
                                activeImage={activeImage}
                                badge={badge}
                                onSelectImage={setActiveImage}
                                onPrev={handlePrev}
                                onNext={handleNext}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}
