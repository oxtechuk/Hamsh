export interface IBrandsCarouselBrand {
  id: string | number;
  name: string;
  logo: string;
  url?: string;
}

export interface IBrandsCarouselProps {
  brands: IBrandsCarouselBrand[];
  showName?: boolean;
}
