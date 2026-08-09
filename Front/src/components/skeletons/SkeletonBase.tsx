interface SkeletonBaseProps {
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

export default function SkeletonBase({
  className = "",
  width,
  height,
  borderRadius = "6px",
}: SkeletonBaseProps) {
  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
      }}
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`}
    />
  );
}
