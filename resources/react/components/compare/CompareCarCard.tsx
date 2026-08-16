import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { APP_IMAGES, getImageUrl } from "../../constants/app-images";
import type { ICompareCarCardProps } from "../../interfaces/ICompareCarCardProps";
import LazyImg from "../LazyImg";
import CompareSpec from "./CompareSpec";

export default function CompareCarCard({
    car,
    onRemove,
}: ICompareCarCardProps) {
    const { t, i18n } = useTranslation();

    const brandName = car.brand?.name ?? "";
    const carName = car.name ?? "";

    const imageSrc = getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER;

    const getSpec = (key: string, fallback: string = "") => {
        const normalizedKey = key.toLowerCase();
        const specs = car.specs;

        const specKeyMap: Record<string, string> = {
            horsepower: "hp",
            fuel: "fuel",
            fueltype: "fuel",
            transmission: "gearbox",
            gearbox: "gearbox",
            seats: "seats",
        };

        if (specs) {
            if (Array.isArray(specs)) {
                const found = specs.find(
                    (s) =>
                        s.label.toLowerCase().includes(normalizedKey) ||
                        normalizedKey.includes(s.label.toLowerCase()),
                );
                if (found?.value) return String(found.value);
            } else if (typeof specs === "object") {
                const mappedKey = specKeyMap[normalizedKey] ?? key;
                const direct =
                    specs[mappedKey] ?? specs[key] ?? specs[normalizedKey];
                if (direct) return String(direct);
            }
        }

        const found = car.specifications.find(
            (s) =>
                s.name.toLowerCase().includes(normalizedKey) ||
                normalizedKey.includes(s.name.toLowerCase()),
        );
        return found?.value || found?.name || fallback;
    };

    const carType = car.type || car.category?.name || "";
    const fuelType = getSpec("fuel");
    const transmission = getSpec("transmission");
    const horsepower = getSpec("horsepower") || null;

    const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onRemove();
    };

    return (
        <article
            dir={i18n.dir()}
            className={[
                "relative flex h-[401px] w-full max-w-[464px]",
                "mx-auto flex-col overflow-hidden",
                "border border-[#E4E1DA]",
                "bg-white",
                "shadow-[0_3px_12px_rgba(15,23,42,0.04)]",
            ].join(" ")}
        >
            {/* Image */}
            <div
                className={[
                    "relative h-[220px] w-full shrink-0 overflow-hidden",
                    "bg-[#F0F0F0]",
                    "sm:h-[266px]",
                ].join(" ")}
            >
                <LazyImg
                    src={imageSrc}
                    alt={carName}
                    className="h-full w-full object-cover"
                />

                {/* Remove button */}
                <button
                    type="button"
                    onClick={handleRemove}
                    aria-label={t("comparePage.removeCar")}
                    title={t("comparePage.removeCar")}
                    className={[
                        "absolute end-5 top-5 z-20",
                        "flex h-[46px] w-[46px]",
                        "items-center justify-center",
                        "rounded-full",
                        "bg-white",
                        "text-[var(--brand-secondary-color)]",
                        "shadow-[0_8px_22px_rgba(15,23,42,0.18)]",
                        "transition duration-300",
                        "hover:scale-105",
                        "hover:bg-[#F7F7F7]",
                    ].join(" ")}
                >
                    <X size={24} strokeWidth={1.8} />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between px-4 pb-2 pt-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 text-start">
                        {brandName && (
                            <p className="truncate text-[13px] font-medium text-[#898989]">
                                {brandName}
                            </p>
                        )}

                        <h2
                            title={carName}
                            className={[
                                "mt-1 line-clamp-1",
                                "text-[17px] font-extrabold",
                                "leading-[1.3]",
                                "text-[#151515]",
                                "sm:text-[18px]",
                            ].join(" ")}
                        >
                            {carName}
                        </h2>
                    </div>

                    {carType && (
                        <span
                            className={[
                                "inline-flex min-h-[28px]",
                                "shrink-0 items-center justify-center",
                                "rounded-[6px]",
                                "bg-[#F3F4F6]",
                                "px-2.5",
                                "text-[12px] font-bold",
                                "text-[var(--brand-secondary-color)]",
                            ].join(" ")}
                        >
                            {carType}
                        </span>
                    )}
                </div>

                {/* Specs */}
                <div className="mt-2 grid grid-cols-3 border-t border-[#E8E3DA] pt-2">
                    <CompareSpec
                        value={horsepower ? String(horsepower) : "—"}
                        label="HP"
                        highlighted
                    />

                    <CompareSpec
                        value={fuelType || "—"}
                        label={t("comparePage.fuel")}
                    />

                    <CompareSpec
                        value={transmission || "—"}
                        label={t("comparePage.transmission")}
                    />
                </div>
            </div>
        </article>
    );
}
