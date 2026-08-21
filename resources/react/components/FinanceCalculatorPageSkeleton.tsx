import Skeleton from "./Skeleton";

export default function FinanceCalculatorPageSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading finance calculator page"
            className="min-h-screen w-full select-none bg-gray-100"
        >
            <div className="mx-auto mb-6 max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
                <Skeleton className="mb-3 h-3 w-40 rounded-md bg-gray-200/50" />
                <Skeleton className="h-9 w-3/4 max-w-[520px] rounded-lg bg-gray-200/60 sm:h-11" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row-reverse">
                    {/* Step form */}
                    <div className="min-w-0 flex-1 space-y-4 rounded-[16px] border border-[#E5E7EB] bg-white p-6 lg:w-3/5">
                        <Skeleton className="h-6 w-1/3 rounded-md bg-gray-200/50" />
                        <Skeleton className="h-[48px] w-full rounded-[10px] bg-gray-200/40" />
                        <Skeleton className="h-[48px] w-full rounded-[10px] bg-gray-200/40" />
                        <Skeleton className="h-[48px] w-full rounded-[10px] bg-gray-200/40" />
                        <Skeleton className="mt-6 h-[52px] w-40 rounded-[10px] bg-gray-200/60" />
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full shrink-0 lg:w-2/5">
                        <div className="bg-white p-5 shadow-sm">
                            <Skeleton className="mb-4 h-3 w-24 rounded-md bg-gray-200/40" />
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-[30px] w-[30px] rounded-[6px] bg-gray-200/50" />
                                        <Skeleton className="h-4 w-28 rounded-md bg-gray-200/40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
