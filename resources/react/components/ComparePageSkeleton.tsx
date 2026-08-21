import Skeleton from "./Skeleton";

export default function ComparePageSkeleton() {
    return (
        <div
            aria-busy="true"
            aria-label="Loading compare page"
            className="min-h-screen w-full select-none overflow-x-hidden"
        >
            <div className="relative z-20 mt-[80px] px-6 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-[minmax(320px,464px)_1fr_minmax(320px,464px)] items-start gap-12 max-lg:grid-cols-1 max-lg:gap-7">
                        <div className="w-full max-lg:order-1">
                            <Skeleton className="h-[401px] w-full rounded-[20px] max-lg:h-[220px]" />
                        </div>

                        <div className="relative flex min-h-[401px] items-center justify-center max-lg:order-2 max-lg:min-h-[130px]">
                            <Skeleton className="h-[54px] w-[54px] rounded-full" />
                        </div>

                        <div className="w-full max-lg:order-3">
                            <Skeleton className="h-[401px] w-full rounded-[20px] max-lg:h-[220px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
