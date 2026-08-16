import type { ICarColor } from "./ICarDetailsHeroProps";

export interface ICarDetailsGalleryProps {
  title: string;
  images: string[];
  currentImages?: string[];
  currentImage: string;
  activeImage: number;
  onImageSelect: (index: number) => void;
  isShowingColorImage: boolean;
  selectedColor: ICarColor | null;
  onClearColor: () => void;
  viewType?: "inside" | "outside";
  onViewChange?: (type: "inside" | "outside") => void;
}
