import Skeleton from "./Skeleton";
import CarCardSkeleton from "./CarCardSkeleton";

export default function CarDetailsPageSkeleton() {
    return (
        <section
            aria-busy="true"
            aria-label="Loading car details page"
            className="w-full select-none bg-gray-100 py-8 sm:py-12"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[820px_1fr] lg:gap-8">
                    {/* Gallery */}
                    <div className="order-1 h-[407px] overflow-hidden border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <Skeleton className="h-full w-full rounded-none bg-gray-200/40" />
                    </div>

                    {/* Technical Specs */}
                    <div className="order-2 flex h-[407px] flex-col border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-8">
                        <Skeleton className="mb-5 h-6 w-40 rounded-md bg-gray-200/50" />
                        <div className="grid flex-1 grid-cols-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={[
                                        "flex flex-col justify-center gap-2 py-4",
                                        i < 4 ? "border-b border-gray-100" : "",
                                        i % 2 === 0 ? "border-e border-gray-100 pe-6" : "ps-6",
                                    ].join(" ")}
                                >
                                    <Skeleton className="h-3 w-16 rounded-md bg-gray-200/40" />
                                    <Skeleton className="h-6 w-20 rounded-md bg-gray-200/50" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info & Pricing */}
                    <div className="order-3 flex w-full flex-col justify-between self-start border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-8">
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <Skeleton className="h-4 w-28 rounded-md bg-gray-200/40" />
                                <Skeleton className="h-6 w-20 rounded-md bg-gray-200/40" />
                            </div>
                            <Skeleton className="mt-4 h-8 w-4/5 rounded-md bg-gray-200/50" />
                        </div>

                        <div className="mt-8">
                            <div className="mb-6 flex items-baseline justify-between gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-16 rounded-md bg-gray-200/40" />
                                    <Skeleton className="h-7 w-24 rounded-md bg-gray-200/50" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-24 rounded-md bg-gray-200/40" />
                                    <Skeleton className="h-7 w-20 rounded-md bg-gray-200/50" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-[48px] flex-[1.4] rounded-md bg-gray-200/50" />
                                <Skeleton className="h-[48px] flex-1 rounded-md bg-gray-200/40" />
                                <Skeleton className="h-[48px] w-[48px] shrink-0 rounded-md bg-gray-200/40" />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="order-4 flex flex-col justify-between border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-8">
                        <Skeleton className="mb-6 h-6 w-32 rounded-md bg-gray-200/50" />
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-6 w-6 shrink-0 rounded-full bg-gray-200/40" />
                                    <Skeleton className="h-4 w-32 rounded-md bg-gray-200/40" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="mt-12">
                    <Skeleton className="mb-6 h-7 w-56 rounded-lg bg-gray-200/50" />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <CarCardSkeleton />
                        <CarCardSkeleton />
                        <CarCardSkeleton />
                    </div>
                </div>
            </div>
        </section>
    );
}
