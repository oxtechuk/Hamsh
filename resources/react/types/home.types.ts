export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  meta: unknown;
}

export interface FilterCategory {
  id: number;
  name: string | Record<string, string>;
  slug: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface BrandInfo {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  cars_count?: number;
}

export interface CarColor {
  hex: string;
  name: string;
}

export interface CarTrim {
  name: string;
  image?: string | null;
  cash_price?: number;
  monthly_installment?: number;
  availability_status?: string;
  engine?: string;
  transmission?: string;
  safety?: string;
  lighting?: string;
  specs?: Record<string, string>;
}

export interface CarItem {
  id: number;
  name: string;
  slug: string;
  main_image: string | null;
  thumbnail: string | null;
  images: string[];
  trims?: CarTrim[];
  cash_price: number;
  min_installment: number;
  current_price: number;
  year: number | string;
  type: string;
  transmission?: string;
  fuel_type?: string;
  seats?: string;
  colors: CarColor[];
  specs: CarSpec[] | Record<string, string | null>;
  description: string;
  features: string;
  is_featured: boolean;
  is_current_year?: boolean;
  availability_status: string;
  highlight?: { id: number; text: string; text_ar: string; color: string } | null;
  views: number;
  brand: BrandInfo;
  active_offers: any[];
}

export interface HomeCarItem {
  id: number;
  name: string;
  slug: string;
  main_image: string | null;
  thumbnail: string | null;
  cash_price: number;
  current_price: number;
  savings: number;
  min_installment: number;
  min_down_payment?: number;
  year: string;
  type?: string;
  transmission?: string;
  fuel_type?: string;
  seats?: string;
  specs?: CarSpec[] | Record<string, string | null>;
  highlight: string | { id: number; text: string; text_ar: string; color: string } | null;
  is_featured?: boolean;
  is_current_year?: boolean;
  availability_status?: string;
  brand: {
    id: number;
    name: string;
  };
}

export interface HeroSlideData {
  image: string | null;
  link: string | null;
  button_text: string;
}

export interface HeroFeature {
  icon: string;
  title: string;
  description: string;
}

export interface HeroData {
  title: {
    badge: string;
    text: string;
  };
  subtitle: {
    badge: string;
    text: string;
  };
  image: string | null;
  description: string;
  button_1: {
    text: string;
    link: string;
  };
  button_2: {
    text: string;
    url: string;
  };
  features: HeroFeature[];
}

export interface SectionMeta {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
}

export interface HomeOfferItem {
  id: number;
  title: string;
  description: string;
  image: string;
  installment_starts_from: number;
  time_remaining: string;
  is_expired: boolean;
  car: {
    id: number;
    name: string;
    slug: string;
    main_image: string;
    cash_price: number;
    brand: { id: number; name: string };
  };
}

export interface BudgetBracket {
  label: string;
  min: number;
  max: number | null;
  count: number;
}

export interface CampaignBanner {
  image: string | null;
  mobile_image: string | null;
  title: string;
  button_text: string;
  url: string | null;
  is_active: boolean;
}

export interface OfferItem {
  id: number;
  title: string;
  image: string | null;
  [key: string]: unknown;
}

export interface ActiveOfferCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  is_expired: boolean;
}

export interface ActiveOffer {
  id: number;
  title: string;
  description: string;
  image: string | null;
  offer_category: string | null;
  user_rated_count: number;
  installment_starts_from: number;
  ends_at: string;
  countdown: ActiveOfferCountdown;
}

export interface HomeStats {
  cars: number;
  brands: number;
}

export interface FeaturedSectionOffer {
  id: number;
  title: string;
  description: string;
  image: string | null;
  installment_starts_from: number;
}

export interface FeaturedSection {
  title: string;
  description: string;
  car: CarItem;
  offer: FeaturedSectionOffer;
}

export interface HomepageStat {
  label: string;
  value: string;
}

export interface FilterPrice {
  min: number;
  max: number | null;
  count: number;
}

export interface PageSectionContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  description?: string;
  features?: string[];
}

export interface PageSections {
  filter?: PageSectionContent;
  featured_cars?: PageSectionContent;
  offers?: PageSectionContent;
  highlighted_cars?: PageSectionContent;
  finance?: PageSectionContent;
  brands?: PageSectionContent;
  budget?: PageSectionContent;
}

export interface FinanceSettingsData {
  finance: PageSectionContent;
  stats: HomepageStat[];
}

export interface HomePageData {
  hero: HeroData;
  hero_slides: HeroSlideData[];
  brands: BrandInfo[];
  latest_cars: {
    section: SectionMeta;
    items: HomeCarItem[];
  };
  why_us: unknown[];
  campaign_banners: CampaignBanner[];
  offers: {
    section: SectionMeta;
    items: HomeOfferItem[];
  };
  cars_by_budget: {
    section: SectionMeta;
    brackets: BudgetBracket[];
    cars: HomeCarItem[];
  };
  featured_cars: HomeCarItem[];
  highlighted_cars: HomeCarItem[];
  page_sections: PageSections;
  homepage_stats?: HomepageStat[];
  filter_brands?: BrandInfo[];
  filter_types?: FilterCategory[];
  filter_categories?: FilterCategory[];
  filter_brand_types?: FilterCategory[];
  filter_years?: (string | { year: string })[];
  filter_models?: string[];
  filter_prices?: FilterPrice[];
  active_offers?: ActiveOffer[];
}
