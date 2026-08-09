import SkeletonBase from "./SkeletonBase";

export default function BlogSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Blog Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <SkeletonBase width="140px" height="20px" className="mx-auto" />
        <SkeletonBase width="280px" height="36px" borderRadius="10px" className="mx-auto" />
      </div>

      {/* Grid of Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 p-4 bg-white space-y-4 shadow-sm">
            <SkeletonBase height="200px" borderRadius="14px" className="w-full" />
            <SkeletonBase width="100px" height="14px" />
            <SkeletonBase width="90%" height="22px" />
            <SkeletonBase width="100%" height="40px" borderRadius="6px" />
            <div className="pt-2 flex justify-between items-center border-t border-gray-100">
              <SkeletonBase width="80px" height="14px" />
              <SkeletonBase width="90px" height="16px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
