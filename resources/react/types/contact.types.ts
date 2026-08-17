export interface IContactDepartment {
  label: string;
  phone: string;
  hours: string;
}

export interface IContactBranch {
  id: number;
  city: string;
  name: string;
  address: string;
  map_link: string;
  departments: IContactDepartment[];
  sort_order: number;
}

export interface IContactPageHero {
  title: string;
  subtitle: string;
  image: string | null;
}

export interface IContactTestimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  image: string | null;
  review_image: string | null;
  rating: number;
}

export interface IContactPageData {
  hero: IContactPageHero;
  branches: IContactBranch[];
  testimonials: IContactTestimonial[];
}

export interface IContactPageApiResponse {
  success: boolean;
  message: string;
  data: IContactPageData;
  errors: null;
  meta: null;
}
