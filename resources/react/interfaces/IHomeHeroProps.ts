import type { IHomeHeroSlide } from "./IHomeHeroSlide";

export interface IHomeHeroProps {
  slides: IHomeHeroSlide[];

  titlePrefix?: string;
  titleHighlight?: string;
  titleLine2?: string;
  titleLine2Prefix?: string;
  titleLine2Highlight?: string;

  description?: string;

  calculatorButtonText?: string;
  calculatorButtonTo?: string;

  browseButtonText?: string;

  stats?: {
    value: string;
    label: string;
  }[];

  autoPlayInterval?: number;

  videoSrc?: string;
  videoPoster?: string;
  videoAutoPlay?: boolean;
}