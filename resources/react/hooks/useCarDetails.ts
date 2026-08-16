import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ICarColor } from "../interfaces/ICarDetailsHeroProps";

interface ISpecEntry {
    label: string;
    value: string;
}

interface IUseCarDetailsOptions {
    images: string[];
    specs?: Record<string, string | null>;
    specifications?: Array<{ id?: number; name: string; value?: string | null }>;
    featuresList?: Array<{ id?: number; name: string; value?: string | null }>;
}

export function useCarDetails({
    images,
    specs,
    specifications = [],
    featuresList = [],
}: IUseCarDetailsOptions) {
    const { t } = useTranslation();

    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState<ICarColor | null>(null);

    const colorImage = selectedColor?.image ?? null;
    const currentImage = colorImage ?? images[activeImage] ?? "";
    const isShowingColorImage = !!colorImage;

    const getSpec = (key: string): string | null => {
        if (specs && specs[key]) {
            return String(specs[key]);
        }
        const found = specifications.find((s) =>
            s.name.toLowerCase().includes(key.toLowerCase()),
        );
        return found?.value ?? null;
    };

    const techSpecs: ISpecEntry[] = [
        { label: t("carDetails.techSpecs.power"), value: getSpec("hp") ?? "" },
        { label: t("carDetails.techSpecs.fuel"), value: getSpec("fuel") ?? "" },
        { label: t("carDetails.techSpecs.capacity"), value: getSpec("seats") ?? "" },
        { label: t("carDetails.techSpecs.transmission"), value: getSpec("gearbox") ?? "" },
    ].filter((s) => s.value !== "");

    const featuresToDisplay: string[] =
        featuresList.length > 0
            ? featuresList.map((f) => (typeof f === "string" ? f : f.name))
            : [];

    return {
        activeImage,
        setActiveImage,
        selectedColor,
        setSelectedColor,
        currentImage,
        isShowingColorImage,
        techSpecs,
        featuresToDisplay,
    };
}
