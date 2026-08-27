import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ICarColor } from "../interfaces/ICarDetailsHeroProps";

interface ISpecEntry {
    label: string;
    value: string;
}

interface IUseCarDetailsOptions {
    images: string[];
    specs?: any;
    specifications?: Array<{ id?: number; name: any; value?: any }>;
    featuresList?: Array<{ id?: number; name: any; value?: any }>;
}

export function useCarDetails({
    images,
    specs,
    specifications = [],
    featuresList = [],
}: IUseCarDetailsOptions) {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === "ar";

    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState<ICarColor | null>(null);

    const colorImage = selectedColor?.image ?? null;
    const currentImage = colorImage ?? images[activeImage] ?? "";
    const isShowingColorImage = !!colorImage;

    const findSpecValue = (aliases: string[]): string | null => {
        // 1. If specs is an Array of objects [{label, value}, ...]
        if (Array.isArray(specs)) {
            for (const item of specs) {
                if (!item || typeof item !== "object") continue;
                const label = String(item.label || item.name || "").toLowerCase().trim();
                if (aliases.some((alias) => label === alias || label.includes(alias))) {
                    if (item.value != null && item.value !== "") {
                        return String(item.value);
                    }
                }
            }
        }

        // 2. If specs is an object { hp: "...", fuel: "..." }
        if (specs && typeof specs === "object" && !Array.isArray(specs)) {
            for (const [key, val] of Object.entries(specs)) {
                if (val == null || val === "") continue;
                const normalizedKey = key.toLowerCase().trim();
                if (aliases.some((alias) => normalizedKey === alias || normalizedKey.includes(alias))) {
                    return String(val);
                }
            }
        }

        // 3. Check specifications relation array
        if (Array.isArray(specifications)) {
            for (const spec of specifications) {
                if (!spec) continue;
                const name = typeof spec.name === "object" && spec.name !== null
                    ? String(spec.name.ar || spec.name.en || "")
                    : String(spec.name || "");
                const normalizedName = name.toLowerCase().trim();
                if (aliases.some((alias) => normalizedName === alias || normalizedName.includes(alias))) {
                    const val = typeof spec.value === "object" && spec.value !== null
                        ? (spec.value.ar || spec.value.en || "")
                        : spec.value;
                    if (val != null && val !== "") return String(val);
                }
            }
        }

        return null;
    };

    const formatSpecValue = (val: string | null): string => {
        if (!val) return "";
        if (!isAr) return val;

        // Localize common English terms in Arabic UI
        let localized = val;
        localized = localized.replace(/Gasoline/gi, "بنزين");
        localized = localized.replace(/Diesel/gi, "ديزل");
        localized = localized.replace(/Hybrid/gi, "هايبرد");
        localized = localized.replace(/Electric/gi, "كهربائي");
        localized = localized.replace(/Automatic/gi, "أوتوماتيك");
        localized = localized.replace(/Manual/gi, "يدوي");
        localized = localized.replace(/(\d+)\s*HP/gi, "$1 حصان");
        localized = localized.replace(/(\d+)\s*Seats?/gi, "$1 مقاعد");
        localized = localized.replace(/FWD/gi, "دفع أمامي");
        localized = localized.replace(/AWD/gi, "دفع رباعي مستمر");
        localized = localized.replace(/RWD/gi, "دفع خلفي");
        localized = localized.replace(/4WD/gi, "دفع رباعي 4X4");

        return localized;
    };

    const powerVal = formatSpecValue(findSpecValue(["horsepower", "قوة", "حصان", "hp", "power"]));
    const fuelVal = formatSpecValue(findSpecValue(["fuel type", "نوع الوقود", "وقود", "fuel"]));
    const capacityVal = formatSpecValue(findSpecValue(["seats", "seating", "مقاعد", "سعة", "ركاب", "capacity"]));
    const transmissionVal = formatSpecValue(findSpecValue(["transmission", "gearbox", "ناقل", "قير"]));
    const engineVal = formatSpecValue(findSpecValue(["engine", "محرك"]));
    const driveVal = formatSpecValue(findSpecValue(["drive", "دفع"]));

    const techSpecs: ISpecEntry[] = [
        { label: t("carDetails.techSpecs.power", { defaultValue: "القوة" }), value: powerVal },
        { label: t("carDetails.techSpecs.fuel", { defaultValue: "نوع الوقود" }), value: fuelVal },
        { label: t("carDetails.techSpecs.capacity", { defaultValue: "سعة المقاعد" }), value: capacityVal },
        { label: t("carDetails.techSpecs.transmission", { defaultValue: "ناقل الحركة" }), value: transmissionVal },
    ].filter((s) => s.value !== "");

    // If less than 4 items, supplement with engine or drive type
    if (techSpecs.length < 4 && engineVal && !techSpecs.some((s) => s.value === engineVal)) {
        techSpecs.push({ label: isAr ? "المحرك" : "Engine", value: engineVal });
    }
    if (techSpecs.length < 4 && driveVal && !techSpecs.some((s) => s.value === driveVal)) {
        techSpecs.push({ label: isAr ? "نظام الدفع" : "Drive Type", value: driveVal });
    }

    const featuresToDisplay: string[] =
        featuresList.length > 0
            ? featuresList.map((f) => {
                  if (typeof f === "string") return f;
                  if (typeof f?.name === "object" && f.name !== null) {
                      return f.name[i18n.language] || f.name.ar || f.name.en || "";
                  }
                  return f?.name || "";
              }).filter(Boolean)
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

