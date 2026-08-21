import Skeleton from "./Skeleton";
import CarCardSkeleton from "./CarCardSkeleton";

export default function HomePageSkeleton() {
    return (
        <div
            aria-busy="true"
            aria-label="Loading home page"
            className="flex w-full select-none flex-col gap-8 overflow-x-hidden sm:gap-10 lg:gap-12"
        >
            {/* 1. HERO */}
            <section className="w-full py-6 sm:py-8 lg:py-10">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-[16px]">
                        <div className="relative h-[54vh] min-h-[240px] sm:h-[62vh] lg:h-[68vh]">
                            <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-gray-200/70" />

                            <Skeleton className="absolute bottom-6 start-6 h-[46px] w-[160px] rounded-md bg-gray-300/70" />

                            <Skeleton className="absolute start-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/80" />
                            <Skeleton className="absolute end-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/80" />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Skeleton className="h-[6px] w-[28px] rounded-full bg-gray-300/70" />
                        <Skeleton className="h-[6px] w-[8px] rounded-full bg-gray-200/60" />
                        <Skeleton className="h-[6px] w-[8px] rounded-full bg-gray-200/60" />
                    </div>
                </div>
            </section>

            {/* 2. CARS SEARCH SECTION */}
            <section className="w-full bg-white py-10 sm:py-12 lg:py-14">
                <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                    <Skeleton className="mx-auto h-8 w-64 rounded-md bg-gray-200/60 sm:h-9 sm:w-80" />

                    <div className="mt-8 flex flex-col gap-3 lg:flex-row">
                        <Skeleton className="h-[56px] flex-1 rounded-md bg-gray-200/40" />
                        <Skeleton className="h-[56px] w-full rounded-[4px] bg-gray-200/60 lg:w-[140px]" />
                        <Skeleton className="h-[56px] w-full rounded-[4px] bg-gray-200/40 lg:w-[140px]" />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton className="mb-2 h-3 w-16 rounded-md bg-gray-200/50" />
                                <Skeleton className="h-[48px] w-full rounded-md bg-gray-200/40" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. BRANDS SECTION */}
            <section className="w-full">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Skeleton className="h-8 w-48 rounded-md bg-gray-200/60" />
                        <Skeleton className="h-[44px] w-[150px] rounded-[8px] bg-gray-200/50" />
                    </div>

                    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
                        <Skeleton className="h-[42px] w-full rounded-md bg-gray-200/40 lg:w-[632px] lg:shrink-0" />
                        <div className="flex flex-wrap items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-[38px] w-20 rounded-md bg-gray-200/50"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Skeleton className="hidden h-10 w-10 shrink-0 rounded-full bg-gray-200/50 sm:block" />

                        <div className="flex min-w-0 flex-1 gap-4 overflow-hidden">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex w-[145px] shrink-0 flex-col items-center gap-2 py-5 sm:w-[170px]"
                                >
                                    <Skeleton className="h-[48px] w-[80px] rounded-md bg-gray-200/50 sm:h-[54px]" />
                                    <Skeleton className="h-3 w-16 rounded-md bg-gray-200/40" />
                                </div>
                            ))}
                        </div>

                        <Skeleton className="hidden h-10 w-10 shrink-0 rounded-full bg-gray-200/50 sm:block" />
                    </div>
                </div>
            </section>

            {/* 4. FEATURED CARS SECTION */}
            <section className="w-full py-10 sm:py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <Skeleton className="h-8 w-48 rounded-md bg-gray-200/60" />
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-10 w-10 rounded-[5px] bg-gray-200/40" />
                            <Skeleton className="h-10 w-10 rounded-[5px] bg-gray-200/40" />
                        </div>
                    </div>

                    <div className="flex gap-6 overflow-hidden">
                        <CarCardSkeleton />
                        <CarCardSkeleton />
                        <CarCardSkeleton />
                        <CarCardSkeleton />
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Skeleton className="h-[46px] w-[180px] rounded-md bg-gray-200/60" />
                    </div>
                </div>
            </section>

            {/* 5. HOME OFFERS SECTION */}
            <section className="w-full py-5 sm:py-7 lg:py-9">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full overflow-hidden aspect-[2.8/1] min-h-[260px] sm:min-h-[340px] lg:min-h-[470px]">
                        <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-gray-200/70" />
                        <Skeleton className="absolute bottom-0 end-0 h-[52px] w-[247px] rounded-none bg-white sm:h-[60px]" />
                    </div>
                </div>
            </section>

            {/* 6. BUDGET CARS SECTION */}
            <section className="w-full py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <Skeleton className="h-8 w-56 rounded-md bg-gray-200/60" />
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-9 w-28 rounded-full bg-gray-200/50"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-6 overflow-hidden">
                        <CarCardSkeleton />
                        <CarCardSkeleton />
                        <CarCardSkeleton />
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6">
                        <Skeleton className="h-10 w-10 rounded-[5px] bg-gray-200/40" />
                        <Skeleton className="h-10 w-10 rounded-[5px] bg-gray-200/40" />
                    </div>
                </div>
            </section>

            {/* 7. PURCHASE EXPERIENCE SECTION */}
            <section className="w-full pb-14 sm:pb-16 lg:pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="border border-gray-200 bg-white px-6 py-6"
                            >
                                <Skeleton className="h-[26px] w-[26px] rounded-md bg-gray-200/50" />
                                <Skeleton className="mt-4 h-5 w-2/3 rounded-md bg-gray-200/50" />
                                <Skeleton className="mt-3 h-4 w-full rounded-md bg-gray-200/40" />
                                <Skeleton className="mt-2 h-4 w-4/5 rounded-md bg-gray-200/40" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
