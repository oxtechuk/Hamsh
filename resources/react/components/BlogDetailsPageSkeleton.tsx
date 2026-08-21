import Skeleton from "./Skeleton";

export default function BlogDetailsPageSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading blog article page"
            className="w-full select-none bg-gray-100"
        >
            {/* Header */}
            <header className="relative w-full overflow-hidden">
                <div className="relative min-h-[180px] w-full overflow-hidden sm:min-h-[220px] lg:min-h-[260px]">
                    <Skeleton className="h-full w-full rounded-none bg-gray-300" />

                    <div className="absolute inset-x-0 bottom-0">
                        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
                            <Skeleton className="h-3 w-24 rounded-md bg-gray-400/60" />
                            <Skeleton className="mt-4 h-9 w-full max-w-[820px] rounded-md bg-gray-400/70 sm:h-11 lg:h-12" />
                            <Skeleton className="mt-2 h-9 w-2/3 max-w-[520px] rounded-md bg-gray-400/50 sm:h-11 lg:h-12" />
                        </div>
                    </div>
                </div>
            </header>

            <section className="w-full py-10 sm:py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Meta */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-gray-200/50" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-28 rounded-md bg-gray-200/50" />
                            <Skeleton className="h-3 w-20 rounded-md bg-gray-200/40" />
                        </div>
                    </div>

                    <div className="mt-5 h-px w-full bg-gray-200" />

                    {/* Article body */}
                    <div className="mt-10 space-y-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className={`h-4 rounded-md bg-gray-200/40 ${
                                    i % 4 === 3 ? "w-2/3" : "w-full"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Summary quote */}
                    <div className="my-10 min-h-[120px] rounded-[16px] border border-gray-200 bg-white p-6">
                        <Skeleton className="h-4 w-full rounded-md bg-gray-200/40" />
                        <Skeleton className="mt-2 h-4 w-5/6 rounded-md bg-gray-200/40" />
                        <Skeleton className="mt-2 h-4 w-2/3 rounded-md bg-gray-200/40" />
                    </div>
                </div>
            </section>
        </main>
    );
}
