import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import CarSearchModal from "../calculator/CarSearchModal";
import LazyImg from "../LazyImg";

import { APP_IMAGES, getImageUrl } from "../../constants/app-images";

import type { IDriveStepTwoProps } from "../../interfaces/IDriveStepTwoProps";
import type { ISelectedDriveCarProps } from "../../interfaces/ISelectedDriveCarProps";

export default function DriveStepTwo({
    cars,
    isLoading = false,
    selectedCar,
    onCarSelect,
    onBack,
    onSubmit,
    submitting = false,
}: IDriveStepTwoProps) {
    const { t, i18n } = useTranslation();

    const [showModal, setShowModal] = useState(false);

    if (isLoading) {
        return <div className="h-[180px] w-full animate-pulse bg-white/60" />;
    }

    return (
        <>
            {showModal && (
                <CarSearchModal
                    cars={cars}
                    onSelect={(car) => {
                        onCarSelect(car);
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}

            <section dir={i18n.dir()} className="w-full">
                <h2 className="text-start text-[27px] font-extrabold text-[#20283A] sm:text-[30px]">
                    {t("drivePage.step2.title")}
                </h2>

                <p className="mt-4 text-start text-[12px] text-[#59647A]">
                    {t("drivePage.step2.description")}
                </p>

                <div className="mt-5">
                    {selectedCar ? (
                        <SelectedDriveCar
                            car={selectedCar}
                            onClick={() => setShowModal(true)}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className={[
                                "flex min-h-[72px] w-full",
                                "items-center justify-between gap-4",
                                "border border-[#E7E0D4]",
                                "bg-white px-5",
                                "text-start",
                                "shadow-[0_6px_18px_rgba(48,58,84,0.04)]",
                                "transition duration-300",
                                "hover:border-[var(--brand-primary-color)]",
                            ].join(" ")}
                        >
                            <span className="text-[13px] font-bold text-[#20283A]">
                                {t("drivePage.step2.chooseCar")}
                            </span>

                            <span className="text-[22px] text-[var(--brand-primary-color)]">
                                +
                            </span>
                        </button>
                    )}
                </div>

                <div className="mt-7 grid grid-cols-[1.8fr_0.8fr] gap-3">
                    <button
                        type="button"
                        disabled={!selectedCar || submitting}
                        onClick={() => {
                            if (!selectedCar) return;
                            onSubmit();
                        }}
                        className={[
                            "flex h-[52px]",
                            "items-center justify-center",
                            "bg-[var(--brand-primary-color)]",
                            "px-6",
                            "text-[13px] font-bold!",
                            "text-[#20283A]",
                            "transition duration-300",
                            "hover:brightness-95",
                            "disabled:cursor-not-allowed",
                            "disabled:opacity-40",
                        ].join(" ")}
                    >
                        {t("drivePage.step2.submit")}
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className={[
                            "flex h-[52px]",
                            "items-center justify-center",
                            "bg-white",
                            "px-5",
                            "text-[13px] font-medium",
                            "text-[#303A54]",
                            "shadow-[0_4px_14px_rgba(48,58,84,0.04)]",
                            "transition duration-300",
                            "hover:bg-[#FAFAF8]",
                        ].join(" ")}
                    >
                        {t("drivePage.step2.back")}
                    </button>
                </div>
            </section>
        </>
    );
}

function SelectedDriveCar({ car, onClick }: ISelectedDriveCarProps) {
    const { t } = useTranslation();

    const image = getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER;

    const brand = typeof car.brand?.name === "string" ? car.brand.name : "";

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex min-h-[76px] w-full",
                "items-center justify-between gap-4",
                "border border-[var(--brand-primary-color)]",
                "bg-white px-4 py-3",
                "text-start",
                "shadow-[0_6px_18px_rgba(48,58,84,0.04)]",
                "transition duration-300",
                "hover:bg-[#FCFAF5]",
            ].join(" ")}
        >
            <div className="flex min-w-0 items-center gap-4">
                <LazyImg
                    src={image}
                    alt={car.name}
                    className="h-[50px] w-[76px] shrink-0 object-cover"
                />

                <div className="min-w-0">
                    <p className="truncate text-[12px] font-extrabold text-[#20283A]">
                        {car.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#737C8E]">
                        {brand}
                        {car.year ? ` · ${car.year}` : ""}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                {car.current_price ? (
                    <span className="text-[12px] font-bold text-[var(--brand-primary-color)]">
                        {car.current_price.toLocaleString()} {t("common.riyal")}
                    </span>
                ) : null}

                <Check
                    size={14}
                    strokeWidth={2}
                    className="text-[var(--brand-primary-color)]"
                />
            </div>
        </button>
    );
}
