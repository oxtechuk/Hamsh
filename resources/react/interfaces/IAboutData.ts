import type { IAboutTestimonial } from "./IAboutTestimonial";

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

export interface IAboutHeroSection {
  badge: string;
  title: string;
  subtitle: string;
  image: string | null;
  mobile_image: string | null;
  cta_text: string;
  cta_url: string | null;
}

export interface IAboutCoreValueItem {
  icon: string;
  title: string;
  description: string | null;
}

export interface IAboutCoreValuesSection {
  section: {
    title: string;
    subtitle: string;
  };
  items: IAboutCoreValueItem[];
}

export interface IAboutCompanyStory {
  title: string;
  description: string;
  mission_title: string;
  mission_text: string;
  vision_title: string;
  vision_text: string;
  image: string | null;
}

export interface IAboutData {
  hero: IAboutHeroSection;
  core_values: IAboutCoreValuesSection;
  company_story: IAboutCompanyStory;
  why_choose_us: IAboutCoreValuesSection;
  gallery: string[];
  testimonials: IAboutTestimonial[];
  about_branches?: IAboutBranch[];
  about_stats?: IAboutStat[];
}
