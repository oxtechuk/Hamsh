import type { IAboutHeroSection } from "./IAboutHeroSection";

export interface IAboutStat {
  label: string;
  value: string;
}

export interface IAboutBranch {
  city: string;
  name: string;
  phone: string;
  address: string;
  map_link: string;
  working_hours: string;
}

export interface IAboutPartner {
  id: number;
  name: string;
  logo: string;
  link: string;
  sort_order: number;
}

export interface IAboutTestimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  image: string | null;
  review_image: string | null;
  rating: number;
}

export interface IAboutStorySection {
  badge: string;
  title: string;
  content: string;
  mission_title: string;
  mission_text: string;
  vision_title: string;
  vision_text: string;
  message_title: string;
  message_text: string;
}

export interface IAboutPartnersSection {
  badge: string;
  title: string;
  subtitle: string;
}

export interface IAboutDealerSection {
  title: string;
  description: string;
  partner_button_text: string;
  partner_button_link: string;
  contact_button_text: string;
}

export interface IAboutLocationsSection {
  title: string;
}

export interface IAboutTestimonialsSection {
  badge: string;
  title: string;
  rating_text: string;
}

export interface IAboutPageSections {
  hero: IAboutHeroSection;
  story: IAboutStorySection;
  partners: IAboutPartnersSection;
  dealer: IAboutDealerSection;
  locations: IAboutLocationsSection;
  testimonials: IAboutTestimonialsSection;
}

export interface IAboutData {
  testimonials: IAboutTestimonial[];
  partners: IAboutPartner[];
  main_gallery: unknown[];
  about_stats: IAboutStat[];
  about_branches: IAboutBranch[];
  page_sections: IAboutPageSections;
}
