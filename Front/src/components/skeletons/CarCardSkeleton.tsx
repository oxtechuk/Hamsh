import SkeletonBase from "./SkeletonBase";

export default function CarCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300">
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 p-3">
        <SkeletonBase className="h-full w-full rounded-xl" />
        <div className="absolute top-4 start-4">
          <SkeletonBase width="64px" height="22px" borderRadius="12px" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        {/* Brand & Year */}
        <div className="flex items-center justify-between">
          <SkeletonBase width="70px" height="16px" />
          <SkeletonBase width="40px" height="16px" />
        </div>

        {/* Title */}
        <SkeletonBase width="80%" height="22px" />

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <SkeletonBase height="32px" borderRadius="8px" />
          <SkeletonBase height="32px" borderRadius="8px" />
          <SkeletonBase height="32px" borderRadius="8px" />
          <SkeletonBase height="32px" borderRadius="8px" />
        </div>

        {/* Price & Installment */}
        <div className="border-t border-gray-100 pt-3 mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <SkeletonBase width="60px" height="14px" />
            <SkeletonBase width="90px" height="20px" />
          </div>
          <div className="flex items-center justify-between">
            <SkeletonBase width="70px" height="14px" />
            <SkeletonBase width="80px" height="18px" />
          </div>
        </div>

        {/* Action Button */}
        <SkeletonBase height="44px" borderRadius="10px" className="w-full mt-2" />
      </div>
    </div>
  );
}
