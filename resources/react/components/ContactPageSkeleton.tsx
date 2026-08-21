import Skeleton from "./Skeleton";

export default function ContactPageSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading contact page"
            className="w-full select-none bg-gray-100"
        >
            {/* Hero + contact methods */}
            <section className="w-full pb-14 pt-8 sm:pb-16 lg:pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-3 w-32 rounded-md bg-gray-200/50" />

                    <Skeleton className="mt-5 h-9 w-3/4 max-w-[520px] rounded-lg bg-gray-200/60 sm:h-11" />

                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-[16px] border border-[#E5E7EB] bg-white p-6"
                            >
                                <Skeleton className="h-[52px] w-[52px] rounded-[14px] bg-gray-200/50" />
                                <Skeleton className="mt-4 h-5 w-2/3 rounded-md bg-gray-200/50" />
                                <Skeleton className="mt-3 h-4 w-full rounded-md bg-gray-200/40" />
                                <Skeleton className="mt-2 h-4 w-3/4 rounded-md bg-gray-200/40" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form + FAQ / branches */}
            <section className="w-full pb-16 sm:pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.95fr_1.15fr] lg:gap-12">
                        {/* Form */}
                        <div className="border border-[#E7E7E7] bg-white px-5 py-6 sm:px-6 sm:py-7">
                            <Skeleton className="h-7 w-1/2 rounded-md bg-gray-200/50" />

                            <div className="mt-5 space-y-4">
                                <Skeleton className="h-[48px] w-full rounded-[4px] bg-gray-200/40" />
                                <Skeleton className="h-[48px] w-full rounded-[4px] bg-gray-200/40" />
                                <Skeleton className="h-[48px] w-full rounded-[4px] bg-gray-200/40" />
                                <Skeleton className="h-[118px] w-full rounded-[4px] bg-gray-200/40" />
                                <Skeleton className="h-[52px] w-full rounded-[4px] bg-gray-200/60" />
                            </div>
                        </div>

                        {/* FAQ + branches */}
                        <div className="space-y-6">
                            <div>
                                <Skeleton className="mb-8 h-7 w-40 rounded-md bg-gray-200/50" />
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-[56px] w-full rounded-[10px] bg-gray-200/40"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5">
                                <Skeleton className="h-5 w-32 rounded-md bg-gray-200/50" />
                                <div className="mt-4 space-y-3">
                                    <Skeleton className="h-4 w-full rounded-md bg-gray-200/40" />
                                    <Skeleton className="h-4 w-2/3 rounded-md bg-gray-200/40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
