import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import { formatPrice } from "./format";
import { localize } from "./localize";

import type { HomeCarItem, BrandInfo } from "../types/home.types";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import type { IBrandCardProps } from "../interfaces/IBrandCardProps";

export function mapHomeCarToCardProps(
  car: HomeCarItem,
  lang: string,
): ICarCardProps | null {
  try {
    const slug = car.slug?.trim();
    if (!slug) return null;

    const getSpec = (label: string): string => {
      if (!car.specs) return "";
      if (Array.isArray(car.specs)) {
        const found = car.specs.find((s) => s.label === label);
        return found?.value ?? "";
      }
      const keyMap: Record<string, string> = {
        "Fuel Type": "fuel",
        Transmission: "gearbox",
        seats: "seats",
      };
      const key = keyMap[label];
      const v = key ? (car.specs as Record<string, unknown>)[key] : undefined;
      return typeof v === "string" ? v : "";
    };

    return {
      id: car.id,
      image: getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER,
      brand: localize(car.brand?.name, lang),
      name: localize(car.name, lang),
      year: String(car.year ?? ""),
      type: car.type ?? "",
      fuelType: getSpec("Fuel Type") || car.fuel_type || "",
      transmission: getSpec("Transmission") || car.transmission || "",
      seats: getSpec("seats") || car.seats || "",
      oldPrice:
        car.savings > 0
          ? formatPrice(car.cash_price, "var(--brand-primary-color)", lang)
          : undefined,
      price: formatPrice(
        car.current_price || car.cash_price,
        "var(--brand-primary-color)",
        lang,
      ),
      monthlyPrice: formatPrice(
        car.min_installment ?? 0,
        "var(--brand-secondary-color)",
        lang,
      ),
      detailsTo: `/cars/${slug}`,
      slug,
      badgeText:
        typeof car.highlight === "string"
          ? car.highlight
          : (car.highlight?.text ?? car.highlight?.text_ar ?? undefined),
      badgeColor:
        typeof car.highlight === "object"
          ? (car.highlight?.color ?? undefined)
          : undefined,
    };
  } catch {
    return null;
  }
}

export function mapBrandToCardProps(
  brand: BrandInfo,
  lang: string,
): IBrandCardProps {
  return {
    id: brand.id,
    name: localize(brand.name, lang),
    logo: getImageUrl(brand.logo) || APP_IMAGES.BRAND_PLACEHOLDER,
  };
}
