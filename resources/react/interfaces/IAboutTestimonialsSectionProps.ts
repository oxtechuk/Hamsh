export interface IAboutTestimonialItem {
  id: string | number;
  quote: string;
  customerName: string;
  customerCar?: string;
  rating?: number;
}

export interface IAboutTestimonialsSectionProps {
  eyebrow?: string;
  title?: string;
  testimonials: IAboutTestimonialItem[];
  className?: string;
}
