import { API_ORIGIN } from "./axios.constants";

const STORAGE_PREFIX = `${API_ORIGIN}/storage/`;

export function getImageUrl(path: string | null): string {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path.replace(/([^:]\/)\//g, "$1");
    }
    const cleanPath = path.replace(/^\/+/, "");
    if (
        cleanPath.startsWith("images/") ||
        cleanPath.startsWith("build/") ||
        cleanPath.startsWith("assets/")
    ) {
        return `${API_ORIGIN}/${cleanPath}`;
    }
    if (cleanPath.startsWith("storage/")) {
        return `${API_ORIGIN}/${cleanPath}`;
    }
    return `${STORAGE_PREFIX}${cleanPath}`;
}

const base = import.meta.env.BASE_URL;
const cleanBase = base.endsWith("/") ? base : `${base}/`;

export const APP_IMAGES = {
    LOGO: `${cleanBase}images/logo_without_bg.svg`,
    LOGO_WHITE: `${cleanBase}images/logo_without_bg_white.svg`,
    HOME_HERO: `${cleanBase}images/home_hero.jpg`,
    CAR1: `${cleanBase}images/car1.png`,
    CAR_PLACEHOLDER: `${cleanBase}images/car-placeholder.png`,
    BRAND_PLACEHOLDER: `${cleanBase}images/brand-placeholder.svg`,
    RIYAL: `${cleanBase}images/riyal.svg`,
    HOME_OFFERS_SECTION: `${cleanBase}images/home-offers-section.png`,
    ALL_CARS_OFFER_IMAGE: `${cleanBase}images/all-cars-offer-page.png`,
    OFFER1: `${cleanBase}images/offer1.png`,
    OFFER_PLACEHOLDER: `${cleanBase}images/offer1.png`,
    OFFER_HERO_PLACEHOLDER: `${cleanBase}images/offer.png`,
    BLOG_PLACEHOLDER: `${cleanBase}images/blog.png`,
    BLOG_AUTHOR_PLACEHOLDER: `${cleanBase}images/blogs/author.png`,
    SOCIAL_TIKTOK: `${cleanBase}images/social/tiktok.png`,
    SOCIAL_FACEBOOK: `${cleanBase}images/social/facebook.png`,
    SOCIAL_INSTAGRAM: `${cleanBase}images/social/instagram.png`,
    ABOUT_VISION: `${cleanBase}images/about_vision.png`,
} as const;
