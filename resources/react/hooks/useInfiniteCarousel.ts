import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  IUseInfiniteCarouselOptions,
  IUseInfiniteCarouselReturn,
} from "../interfaces/IUseInfiniteCarousel";

const GAP = 28;

function getVisible(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function useInfiniteCarousel<T>({
  items,
  autoPlayInterval = 4000,
  isRTL = false,
  visibleCount,
}: IUseInfiniteCarouselOptions<T>): IUseInfiniteCarouselReturn<T> {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [responsiveVisible, setResponsiveVisible] = useState(() =>
    typeof window !== "undefined" ? getVisible(window.innerWidth) : 3,
  );
  const [isPaused, setIsPaused] = useState(false);

  const visible = visibleCount ?? responsiveVisible;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setContainerWidth(w);
    });
    ro.observe(el);
    if (el.offsetWidth > 0) setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (visibleCount != null) return;
    function handleResize() {
      setResponsiveVisible(getVisible(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visibleCount]);

  const n = items.length;
  const effectiveWidth = containerWidth > 0 ? containerWidth : 900;
  const cardWidth = Math.floor(
    (effectiveWidth - GAP * (visible - 1)) / visible,
  );
  const step = cardWidth + GAP;

  const track = useMemo(() => {
    if (n === 0) return [];
    if (n <= visible) return items;
    const prefix = items.slice(n - visible);
    const suffix = items.slice(0, visible);
    return [...prefix, ...items, ...suffix];
  }, [items, n, visible]);

  const canLoop = n > visible;
  const [idx, setIdx] = useState(canLoop ? visible : 0);
  const [animated, setAnimated] = useState(false);
  const jumping = useRef(false);

  useEffect(() => {
    jumping.current = false;
    setAnimated(false);
    setIdx(canLoop ? visible : 0);
  }, [items, visible, canLoop]);

  const silentJump = useCallback((to: number) => {
    jumping.current = true;
    setAnimated(false);
    setIdx(to);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimated(true);
        jumping.current = false;
      }),
    );
  }, []);

  const next = useCallback(() => {
    if (jumping.current) return;
    setAnimated(true);
    setIdx((p) => p + 1);
  }, []);

  const prev = useCallback(() => {
    if (jumping.current) return;
    setAnimated(true);
    setIdx((p) => p - 1);
  }, []);

  const onTransitionEnd = useCallback(() => {
    if (!canLoop) return;
    if (idx >= visible + n) silentJump(idx - n);
    else if (idx < visible) silentJump(idx + n);
  }, [idx, n, visible, canLoop, silentJump]);

  useEffect(() => {
    if (isPaused || !canLoop) return;
    const id = setInterval(next, autoPlayInterval);
    return () => clearInterval(id);
  }, [isPaused, canLoop, next, autoPlayInterval]);

  useEffect(() => {
    const handle = () => setIsPaused(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, []);

  const translateX = isRTL ? step * idx : -(step * idx);

  return {
    track,
    containerRef,
    cardWidth,
    translateX,
    animated,
    canLoop,
    isPaused,
    setIsPaused,
    next,
    prev,
    onTransitionEnd,
  };
}

export { GAP };
