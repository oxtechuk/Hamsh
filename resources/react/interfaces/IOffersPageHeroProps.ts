export interface IOffersPageHeroProps {
  image: string;
  badgeText: string;
  title1: string;
  title2: string;
  description: string;
  carLabel?: string;
  endsAt?: string;
  discountPercent?: number | null;
  specialPrice?: number | null;
  primaryButtonText: string;
  primaryButtonTo: string;
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    is_expired: boolean;
  } | null;
}
