import Skeleton from "./Skeleton";

export default function CarCardSkeleton() {
    return (
        <article className="relative flex w-full flex-col overflow-hidden rounded-xl border border-[#E8E7E3] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            {/* Image Placeholder */}
            <div className="relative h-[210px] sm:h-[230px] w-full bg-[#F4F4F4]">
                <Skeleton className="h-full w-full rounded-none bg-gray-200/50" />
                {/* Badge Skeleton */}
                <div className="absolute top-3 start-3">
                    <Skeleton className="h-6 w-20 rounded-sm bg-gray-300/60" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col justify-between border-b-2 border-[#E3E1DC] p-5 text-start">
                <div>
                    {/* Brand & Details Row Skeleton */}
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-4 w-16 rounded-md bg-gray-200/60" />
                        <Skeleton className="h-6 w-24 rounded-[6px] bg-gray-200/60" />
                    </div>

                    {/* Title Skeleton */}
                    <Skeleton className="mt-2.5 h-6 w-3/4 rounded-md bg-gray-200/60" />

                    {/* Spec Pills Skeleton */}
                    <div className="mt-3.5 mb-4 flex items-center gap-1.5">
                        <Skeleton className="h-6 w-20 rounded-[6px] bg-gray-200/60" />
                        <Skeleton className="h-6 w-16 rounded-[6px] bg-gray-200/60" />
                        <Skeleton className="h-6 w-8 rounded-[6px] bg-gray-200/60" />
                    </div>
                </div>

                <div>
                    {/* Prices Row Skeleton */}
                    <div className="mb-5 flex items-baseline justify-between gap-2">
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-14 rounded bg-gray-200/60" />
                            <Skeleton className="h-6 w-24 rounded bg-gray-200/60" />
                        </div>
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-14 rounded bg-gray-200/60" />
                            <Skeleton className="h-5 w-20 rounded bg-gray-200/60" />
                        </div>
                    </div>

                    {/* Action Buttons Row Skeleton */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <Skeleton className="h-[44px] w-full rounded-[6px] bg-gray-200/60" />
                        <Skeleton className="h-[44px] w-full rounded-[6px] bg-gray-200/60" />
                    </div>
                </div>
            </div>
        </article>
    );
}

