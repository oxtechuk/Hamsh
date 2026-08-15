import type { TFunction } from "i18next";

export function buildCarSpecPills(
  t: TFunction,
  transmission?: string,
  fuelType?: string,
  seats?: string,
): string[] {
  const defaultTransmission = t("carCard.automatic");
  const defaultFuelType = t("carCard.gasoline");

  const seatsLabel =
    seats && typeof seats === "string" && seats.includes("ح")
      ? seats
      : t("carCard.seatsCount", { count: seats });

  return [
    transmission || defaultTransmission,
    fuelType || defaultFuelType,
    seats ? seatsLabel : t("carCard.fallbackEngine"),
  ].filter(Boolean);
}
