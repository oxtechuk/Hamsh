import Skeleton from "./Skeleton";
import BlogCardSkeleton from "./blogs/BlogCardSkeleton";

export default function BlogsPageSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading blog page" className="w-full select-none">
            {/* Hero */}
            <section className="relative flex min-h-[270px] w-full flex-col overflow-hidden bg-gray-200">
                <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-8 lg:px-12 xl:px-[70px]">
                    <div className="flex flex-1 items-center">
                        <div className="max-w-[620px]">
                            <Skeleton className="h-3 w-28 rounded-full bg-gray-300/70" />
                            <Skeleton className="mt-5 h-9 w-full max-w-[520px] rounded-md bg-gray-300/70 sm:h-11" />
                            <Skeleton className="mt-3 h-4 w-full max-w-[500px] rounded-md bg-gray-300/50" />
                        </div>
                    </div>

                    <div className="h-px w-full bg-gray-300/50" />

                    <div className="flex items-center gap-6 overflow-x-auto py-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-4 w-20 shrink-0 rounded-md bg-gray-300/70"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured */}
            <section className="w-full bg-gray-100 py-10 sm:py-12 lg:py-14">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:gap-10">
                        <div className="relative min-h-[520px] overflow-hidden bg-gray-200">
                            <Skeleton className="h-full w-full rounded-none bg-gray-300/50" />
                        </div>

                        <div className="border border-gray-200">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={[
                                        "grid h-[108px] grid-cols-[1fr_105px] items-center gap-4 px-5",
                                        i !== 3 ? "border-b border-gray-200" : "",
                                    ].join(" ")}
                                >
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20 rounded-md bg-gray-200/50" />
                                        <Skeleton className="h-4 w-full rounded-md bg-gray-200/50" />
                                        <Skeleton className="h-3 w-16 rounded-md bg-gray-200/40" />
                                    </div>
                                    <Skeleton className="h-[80px] w-[105px] rounded-none bg-gray-200/40" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest articles */}
            <section className="w-full py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
