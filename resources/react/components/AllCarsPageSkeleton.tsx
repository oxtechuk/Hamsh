import Skeleton from "./Skeleton";
import CarCardSkeleton from "./CarCardSkeleton";

export default function AllCarsPageSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading cars page"
            className="w-full select-none"
        >
            {/* Hero */}
            <section className="w-full bg-gray-200">
                <div className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
                    <div className="flex min-h-[145px] items-start justify-start">
                        <div className="max-w-[460px] text-start">
                            <Skeleton className="h-3 w-24 rounded-md bg-gray-300/70" />
                            <Skeleton className="mt-3 h-9 w-64 rounded-lg bg-gray-300/70 sm:h-10 sm:w-72" />
                            <Skeleton className="mt-4 h-3 w-40 rounded-md bg-gray-300/50" />
                        </div>
                    </div>
                </div>

                {/* Filters bar */}
                <div className="border-t border-white/[0.04] bg-white">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row lg:items-stretch">
                            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-3 lg:py-0 lg:gap-0">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex h-[56px] min-w-[82px] items-center justify-center border-s border-[#ECECEC] px-5 lg:border-s"
                                    >
                                        <Skeleton className="h-4 w-14 rounded-md bg-gray-200/60" />
                                    </div>
                                ))}
                            </div>

                            <div className="flex h-[56px] min-w-0 flex-1 items-center border-t border-[#ECECEC] px-10 lg:border-s lg:border-t-0">
                                <Skeleton className="h-4 w-full max-w-[240px] rounded-md bg-gray-200/50" />
                            </div>

                            <div className="flex h-[56px] min-w-[150px] items-center justify-center border-t border-[#ECECEC] px-5 lg:border-s lg:border-t-0">
                                <Skeleton className="h-4 w-20 rounded-md bg-gray-200/50" />
                            </div>

                            <div className="flex h-[56px] min-w-[110px] items-center justify-center px-5">
                                <Skeleton className="h-4 w-16 rounded-md bg-gray-200/60" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="min-w-0 flex-1">
                    <div className="mb-5">
                        <Skeleton className="mt-2 h-4 w-32 rounded-md bg-gray-200/50" />
                    </div>

                    <div className="grid grid-cols-1 items-stretch justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CarCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
