export interface IUseInfiniteCarouselOptions<T> {
  items: T[];
  autoPlayInterval?: number;
  isRTL?: boolean;
  visibleCount?: number;
}

export interface IUseInfiniteCarouselReturn<T> {
  track: T[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  cardWidth: number;
  translateX: number;
  animated: boolean;
  canLoop: boolean;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  next: () => void;
  prev: () => void;
  onTransitionEnd: () => void;
}
