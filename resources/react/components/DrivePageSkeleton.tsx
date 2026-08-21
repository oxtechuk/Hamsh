import Skeleton from "./Skeleton";

export default function DrivePageSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading drive page"
            className="min-h-screen w-full select-none bg-gray-100"
        >
            {/* Header */}
            <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 lg:px-10">
                <Skeleton className="h-3 w-28 rounded-md bg-gray-200/50" />
                <Skeleton className="mt-3 h-9 w-3/4 max-w-[420px] rounded-lg bg-gray-200/60 sm:h-11" />
            </div>

            <section className="w-full pb-16 pt-10 sm:pt-12">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    <div className="flex flex-col gap-8 lg:flex-row-reverse">
                        {/* Form */}
                        <div className="min-w-0 flex-1 lg:w-3/5 space-y-4 rounded-[16px] border border-[#E5E7EB] bg-white p-6">
                            <Skeleton className="h-6 w-1/3 rounded-md bg-gray-200/50" />
                            <Skeleton className="h-[48px] w-full rounded-[10px] bg-gray-200/40" />
                            <Skeleton className="h-[48px] w-full rounded-[10px] bg-gray-200/40" />
                            <Skeleton className="h-[48px] w-full rounded-[10px] bg-gray-200/40" />
                            <Skeleton className="h-[48px] w-full rounded-[10px] bg-gray-200/40" />
                            <Skeleton className="mt-6 h-[52px] w-40 rounded-[10px] bg-gray-200/60" />
                        </div>

                        {/* Stepper aside */}
                        <aside className="w-full shrink-0 lg:w-2/5">
                            <div className="min-h-[470px] w-full overflow-hidden bg-white">
                                <div className="px-8 py-10">
                                    <Skeleton className="mb-8 h-3 w-28 rounded-md bg-gray-200/40" />
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-[32px] w-[32px] rounded-md bg-gray-200/50" />
                                            <Skeleton className="h-4 w-24 rounded-md bg-gray-200/40" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-[32px] w-[32px] rounded-md bg-gray-200/50" />
                                            <Skeleton className="h-4 w-24 rounded-md bg-gray-200/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
