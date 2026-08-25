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
  const [activeSrc, setActiveSrc] = useState<string>(eager ? (src as string) : PLACEHOLDER);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);

    if (eager) {
      setActiveSrc(src as string);
      return;
    }

    setActiveSrc(PLACEHOLDER);
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(src as string);
          observer.unobserve(el);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, eager]);

  const isPlaceholder = activeSrc === PLACEHOLDER;

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {/* Skeleton Pulse Overlay */}
      {!loaded && !failed && (
        <div className="absolute inset-0 bg-[#E8E7E3] animate-pulse z-0" />
      )}

      <img
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        {...rest}
        ref={imgRef}
        src={activeSrc}
        onLoad={(e) => {
          if (isPlaceholder) return;
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          if (!failed) {
            setFailed(true);
            setActiveSrc(FALLBACK_IMAGE);
          }
          setLoaded(true);
          onError?.(e);
        }}
        className={`w-full h-full object-cover relative z-10 transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          ...style,
          objectFit: failed ? "contain" : style?.objectFit,
        }}
      />
    </div>
  );
}
