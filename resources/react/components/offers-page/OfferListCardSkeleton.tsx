import Skeleton from "../Skeleton";

export default function OfferListCardSkeleton() {
    return (
        <article className="mx-auto flex w-full flex-col overflow-hidden border border-gray-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <div className="relative h-[200px] w-full shrink-0 bg-gray-100">
                <Skeleton className="h-full w-full rounded-none bg-gray-200/40" />
                <div className="absolute top-5 start-5">
                    <Skeleton className="h-[40px] w-28 bg-gray-200/60" />
                </div>
            </div>

            <div className="flex flex-1 flex-col items-start px-6 pb-6 pt-7 sm:px-8">
                <Skeleton className="h-6 w-3/4 bg-gray-200/50" />
                <Skeleton className="mt-3 h-4 w-full bg-gray-200/40" />
                <Skeleton className="mt-2 h-4 w-2/3 bg-gray-200/40" />

                <div className="mt-6 flex w-full items-center justify-between gap-3">
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16 bg-gray-200/40" />
                        <Skeleton className="h-5 w-24 bg-gray-200/50" />
                    </div>
                    <Skeleton className="h-[38px] w-[90px] rounded-[4px] bg-gray-200/60" />
                </div>
            </div>
        </article>
    );
}
