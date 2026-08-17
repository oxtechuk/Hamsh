import type { IAboutStatViewModel } from "../interfaces/IAboutStatViewModel";
import type { IAboutTestimonialViewModel } from "../interfaces/IAboutTestimonialViewModel";
import type { IAboutCoreValueViewModel } from "../interfaces/IAboutCoreValueViewModel";

export const FALLBACK_STATS: IAboutStatViewModel[] = [
  {
    id: 1,
    value: "+12",
    label: "aboutPage.stats.0.label",
    description: "aboutPage.stats.0.description",
  },
  {
    id: 2,
    value: "+5000",
    label: "aboutPage.stats.1.label",
    description: "aboutPage.stats.1.description",
  },
  {
    id: 3,
    value: "+24",
    label: "aboutPage.stats.2.label",
    description: "aboutPage.stats.2.description",
  },
  {
    id: 4,
    value: "98%",
    label: "aboutPage.stats.3.label",
    description: "aboutPage.stats.3.description",
  },
];

export const FALLBACK_TESTIMONIALS: IAboutTestimonialViewModel[] = [
  {
    id: 1,
    quote: "aboutPage.testimonials.items.0.quote",
    customerName: "aboutPage.testimonials.items.0.customerName",
    customerCar: "aboutPage.testimonials.items.0.customerCar",
    rating: 5,
  },
  {
    id: 2,
    quote: "aboutPage.testimonials.items.1.quote",
    customerName: "aboutPage.testimonials.items.1.customerName",
    customerCar: "aboutPage.testimonials.items.1.customerCar",
    rating: 5,
  },
  {
    id: 3,
    quote: "aboutPage.testimonials.items.2.quote",
    customerName: "aboutPage.testimonials.items.2.customerName",
    customerCar: "aboutPage.testimonials.items.2.customerCar",
    rating: 5,
  },
];

export const FALLBACK_CORE_VALUES: IAboutCoreValueViewModel[] = [
  {
    id: 1,
    title: "aboutPage.fallbackCoreValues.care.title",
    description: "aboutPage.fallbackCoreValues.care.description",
    icon: "belonging",
  },
  {
    id: 2,
    title: "aboutPage.fallbackCoreValues.speed.title",
    description: "aboutPage.fallbackCoreValues.speed.description",
    icon: "excellence",
  },
  {
    id: 3,
    title: "aboutPage.fallbackCoreValues.quality.title",
    description: "aboutPage.fallbackCoreValues.quality.description",
    icon: "transparency",
  },
  {
    id: 4,
    title: "aboutPage.fallbackCoreValues.trust.title",
    description: "aboutPage.fallbackCoreValues.trust.description",
  },
];
