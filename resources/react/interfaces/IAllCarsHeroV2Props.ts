import type { HomepageStat } from "../types/home.types";

export interface IAllCarsHeroV2Props {
  offerImage: string;
  badge?: string;
  titleLine1?: string;
  titleLine2Prefix?: string;
  titleLine2Highlight?: string;
  description?: string;
  stats?: HomepageStat[];
  primaryButtonText?: string;
  primaryButtonTo?: string;
}
