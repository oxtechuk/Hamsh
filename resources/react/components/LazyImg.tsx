import { type ImgHTMLAttributes, useRef, useState, useEffect } from "react";

const PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23F1F1EF'/%3E%3Cpath d='M30 65 42 50 52 60 62 45 74 65Z' fill='%23D8D6D0'/%3E%3Ccircle cx='38' cy='38' r='6' fill='%23D8D6D0'/%3E%3C/svg%3E";

interface LazyImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  eager?: boolean;
}

export default function LazyImg(props: LazyImgProps) {
  const { src, className, style, onLoad, onError, eager = false, ...rest } = props;
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    if (eager) {
      el.src = src as string;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = el;
          img.src = src as string;
          observer.unobserve(img);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, eager]);

  return (
    <img
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      {...rest}
      ref={imgRef}
      src={PLACEHOLDER}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        if (!failed) {
          setFailed(true);
          e.currentTarget.src = FALLBACK_IMAGE;
        }
        setLoaded(true);
        onError?.(e);
      }}
      className={className}
      style={{
        ...style,
        objectFit: failed ? "contain" : style?.objectFit,
        clipPath: loaded ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition:
          "clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease-in-out",
      }}
    />
  );
}
