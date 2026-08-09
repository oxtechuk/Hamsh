import SkeletonBase from "./SkeletonBase";

export default function CarDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Top Breadcrumb & Header */}
      <div className="space-y-3">
        <SkeletonBase width="200px" height="18px" />
        <SkeletonBase width="320px" height="36px" borderRadius="10px" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[320px] sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-sm">
            <SkeletonBase className="w-full h-full" borderRadius="16px" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <SkeletonBase height="80px" borderRadius="12px" />
            <SkeletonBase height="80px" borderRadius="12px" />
            <SkeletonBase height="80px" borderRadius="12px" />
            <SkeletonBase height="80px" borderRadius="12px" />
          </div>
        </div>

        {/* Right Column: Info & Finance Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-gray-100 p-6 space-y-5 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <SkeletonBase width="100px" height="24px" />
              <SkeletonBase width="60px" height="20px" />
            </div>

            <div className="space-y-2 border-y border-gray-100 py-4">
              <SkeletonBase width="120px" height="16px" />
              <SkeletonBase width="180px" height="32px" borderRadius="8px" />
              <SkeletonBase width="140px" height="18px" />
            </div>

            <div className="space-y-3 pt-2">
              <SkeletonBase height="50px" borderRadius="10px" className="w-full" />
              <SkeletonBase height="50px" borderRadius="10px" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="rounded-2xl border border-gray-100 p-6 bg-white space-y-6">
        <SkeletonBase width="180px" height="24px" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBase key={i} height="70px" borderRadius="12px" />
          ))}
        </div>
      </div>
    </div>
  );
}
