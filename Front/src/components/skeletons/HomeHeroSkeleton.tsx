import SkeletonBase from "./SkeletonBase";

export default function HomeHeroSkeleton() {
  return (
    <div className="w-full py-6 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-20">
          {/* Left Text Column */}
          <div className="space-y-6 text-center lg:text-start">
            <div className="flex justify-center lg:justify-start gap-3">
              <SkeletonBase width="120px" height="50px" borderRadius="12px" />
              <SkeletonBase width="160px" height="50px" borderRadius="12px" />
            </div>
            <SkeletonBase width="240px" height="40px" borderRadius="10px" className="mx-auto lg:mx-0" />
            <SkeletonBase width="90%" height="60px" borderRadius="8px" className="mx-auto lg:mx-0 max-w-lg" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 pt-2">
              <SkeletonBase height="52px" borderRadius="8px" />
              <SkeletonBase height="52px" borderRadius="8px" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-md mx-auto lg:mx-0">
              <SkeletonBase height="45px" borderRadius="8px" />
              <SkeletonBase height="45px" borderRadius="8px" />
              <SkeletonBase height="45px" borderRadius="8px" />
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="w-full h-[280px] sm:h-[420px] rounded-3xl overflow-hidden shadow-lg">
            <SkeletonBase className="w-full h-full" borderRadius="24px" />
          </div>
        </div>
      </div>
    </div>
  );
}
