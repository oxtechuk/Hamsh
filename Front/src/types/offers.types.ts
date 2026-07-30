export interface OfferCar {
  id: number;
  name: string;
  slug: string;
  main_image: string | null;
  thumbnail: string | null;
  cash_price: number;
  current_price: number;
  savings: number;
  min_installment: number;
  min_down_payment: number;
  type: string;
  year: string;
  specs: { label: string; value: string }[];
  colors: { hex: string; name: string }[];
  is_featured: boolean;
  availability_status: string;
  highlight: { id?: number; text?: string; text_ar?: string; color?: string } | null;
  is_current_year: boolean;
  brand: { id: number; name: string };
}

export interface OfferData {
  id: number;
  title: string;
  description: string;
  image: string | null;
  offer_category: string | null;
  user_rated_count: number;
  discount_percent: number | null;
  special_price: number | null;
  special_installment: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  cars_count: number;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    is_expired: boolean;
  };
}

export interface OffersMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  hero: {
    title: { badge: string; text: string };
    subtitle: { badge: string; text: string };
    image: string | null;
    colored_title: string;
    description: string;
    button_1: { text: string; link: string };
    button_2: { text: string; url: string };
    features: unknown[];
  };
  main_gallery: string[];
  main_offer: OfferData | null;
}

export interface OffersApiResponse {
  success: boolean;
  message: string;
  data: OfferData[];
  errors: null;
  meta: OffersMeta;
}
