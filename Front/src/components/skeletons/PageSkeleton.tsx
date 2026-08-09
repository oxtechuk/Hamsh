import SkeletonBase from "./SkeletonBase";

export default function PageSkeleton() {
  return (
    <div className="w-full min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Banner Skeleton */}
        <div className="h-[200px] w-full rounded-2xl overflow-hidden">
          <SkeletonBase className="w-full h-full" borderRadius="16px" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <SkeletonBase height="32px" width="60%" borderRadius="8px" />
            <SkeletonBase height="16px" width="100%" />
            <SkeletonBase height="16px" width="95%" />
            <SkeletonBase height="16px" width="88%" />
            <SkeletonBase height="140px" width="100%" borderRadius="12px" />
          </div>
          <div className="space-y-4">
            <SkeletonBase height="220px" width="100%" borderRadius="12px" />
          </div>
        </div>
      </div>
    </div>
  );
}
