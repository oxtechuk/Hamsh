export interface IOfferCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  is_expired: boolean;
}

export interface IOfferListCardProps {
  id: string | number;
  image: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  carName?: string;
  priceLabel: string;
  price: number;
  priceUnit?: string;
  expiresAt?: string;
  isExpired?: boolean;
  countdown?: IOfferCountdown;
  endsAtLabel?: string;
  savings?: number;
  minInstallment?: number;
  buttonText: string;
  buttonTo: string;
}
