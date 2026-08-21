import Skeleton from "./Skeleton";
import OfferListCardSkeleton from "./offers-page/OfferListCardSkeleton";

export default function OffersPageSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading offers page" className="w-full select-none">
            {/* Hero */}
            <section className="w-full bg-gray-100 pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-center py-2">
                        <Skeleton className="h-3 w-40 bg-gray-200/40" />
                        <Skeleton className="mt-3 h-9 w-72 bg-gray-200/50 sm:h-10 sm:w-96" />
                        <Skeleton className="mt-3 h-4 w-full max-w-[560px] bg-gray-200/40" />
                    </div>

                    <div className="mt-8 grid overflow-hidden border border-gray-200 bg-white lg:mt-12 lg:h-[435px] lg:grid-cols-2">
                        <div className="relative order-1 min-h-[220px] bg-gray-100 sm:min-h-[340px] lg:min-h-[435px]">
                            <Skeleton className="h-full w-full rounded-none bg-gray-200/40" />
                            <div className="absolute start-5 top-5">
                                <Skeleton className="h-9 w-32 bg-gray-200/60" />
                            </div>
                        </div>

                        <div className="order-2 flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-8">
                            <Skeleton className="h-8 w-3/4 bg-gray-200/50" />
                            <Skeleton className="mt-3 h-4 w-1/2 bg-gray-200/40" />

                            <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-[56px] w-full rounded-none bg-gray-200/40 sm:h-[64px]" />
                                ))}
                            </div>

                            <Skeleton className="my-5 h-px w-full bg-gray-200/40" />

                            <Skeleton className="h-9 w-40 bg-gray-200/50" />

                            <Skeleton className="mt-5 h-[50px] w-full bg-gray-200/60" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Offers grid */}
            <section className="w-full py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <OfferListCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
