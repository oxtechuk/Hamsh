import Skeleton from "./Skeleton";

export default function AboutPageSkeleton() {
    return (
        <div
            aria-busy="true"
            aria-label="Loading about page"
            className="w-full select-none bg-gray-100"
        >
            {/* Breadcrumb */}
            <div className="mx-auto max-w-7xl px-4 pt-6 pb-6 sm:px-6 lg:px-8">
                <Skeleton className="h-4 w-40 rounded-md bg-gray-200/50" />
            </div>

            {/* Statement */}
            <section className="w-full bg-gray-200 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                    <div className="flex min-h-[150px] flex-col items-center justify-center gap-3 text-center">
                        <Skeleton className="h-6 w-full max-w-[700px] rounded-md bg-gray-300/70" />
                        <Skeleton className="h-6 w-full max-w-[520px] rounded-md bg-gray-300/50" />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="w-full bg-gray-100 pt-16 pb-8 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-16">
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-2 gap-px bg-gray-200 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex min-h-[140px] flex-col items-center justify-center gap-2 bg-gray-100 px-4 py-8 sm:min-h-[155px]"
                            >
                                <Skeleton className="h-8 w-16 rounded-md bg-gray-200/50" />
                                <Skeleton className="h-4 w-20 rounded-md bg-gray-200/40" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="mb-16 w-full bg-white py-4 sm:mb-20 sm:py-6 lg:mb-24 lg:py-8">
                <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 overflow-hidden bg-white lg:grid-cols-2">
                        <div className="flex flex-col justify-center gap-4 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
                            <Skeleton className="h-3 w-28 rounded-md bg-gray-200/50" />
                            <Skeleton className="h-8 w-full max-w-[420px] rounded-md bg-gray-200/50" />
                            <Skeleton className="h-8 w-3/4 max-w-[320px] rounded-md bg-gray-200/40" />
                            <Skeleton className="mt-2 h-4 w-full rounded-md bg-gray-200/40" />
                            <Skeleton className="h-4 w-5/6 rounded-md bg-gray-200/40" />
                        </div>

                        <div className="relative min-h-[250px] overflow-hidden sm:min-h-[320px] lg:min-h-0">
                            <Skeleton className="h-full w-full rounded-none bg-gray-200/50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="w-full bg-gray-200 py-14 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex items-center justify-between">
                        <Skeleton className="h-8 w-52 rounded-md bg-gray-300/70" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-[5px] bg-gray-300/50" />
                            <Skeleton className="h-10 w-10 rounded-[5px] bg-gray-300/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-px sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex min-h-[300px] flex-col gap-3 bg-white px-7 py-7"
                            >
                                <Skeleton className="h-4 w-full rounded-md bg-gray-200/40" />
                                <Skeleton className="h-4 w-full rounded-md bg-gray-200/40" />
                                <Skeleton className="h-4 w-2/3 rounded-md bg-gray-200/40" />
                                <div className="mt-auto flex flex-col items-end gap-2">
                                    <Skeleton className="h-3 w-24 rounded-md bg-gray-200/50" />
                                    <Skeleton className="h-3 w-16 rounded-md bg-gray-200/40" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="w-full bg-gray-100 py-14 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="min-h-[170px] bg-white px-7 py-7"
                            >
                                <Skeleton className="h-6 w-6 rounded-md bg-gray-200/50" />
                                <Skeleton className="mt-5 h-5 w-2/3 rounded-md bg-gray-200/50" />
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
