import SkeletonBase from "./SkeletonBase";

export default function OffersSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Offers Hero Banner */}
      <div className="h-[220px] sm:h-[300px] w-full rounded-3xl overflow-hidden shadow-sm">
        <SkeletonBase className="w-full h-full" borderRadius="24px" />
      </div>

      {/* Grid of Offers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 p-5 bg-white space-y-4 shadow-sm">
            <SkeletonBase height="180px" borderRadius="12px" className="w-full" />
            <div className="flex justify-between items-center">
              <SkeletonBase width="140px" height="22px" />
              <SkeletonBase width="60px" height="24px" borderRadius="12px" />
            </div>
            <SkeletonBase width="90%" height="16px" />
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <SkeletonBase width="100px" height="20px" />
              <SkeletonBase width="110px" height="38px" borderRadius="8px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
