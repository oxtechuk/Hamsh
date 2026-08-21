import type { IHomeHeroSlide } from "./IHomeHeroSlide";

export interface IHomeHeroProps {
  slides: IHomeHeroSlide[];
  autoPlayInterval?: number;
}
