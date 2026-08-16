import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getCarBySlug, compareCars } from "../services/api/cars.service";
import { localize } from "../utils/localize";
import { useLanguageStore } from "../store/language.store";

export function useCompare() {
    const language = useLanguageStore((s) => s.language);
    const [searchParams] = useSearchParams();
    const initialSlug = searchParams.get("slug") || "";

    const [car1Slug, setCar1Slug] = useState(initialSlug);
    const [car2Slug, setCar2Slug] = useState("");

    const [showSearch1, setShowSearch1] = useState(!initialSlug);
    const [showSearch2, setShowSearch2] = useState(false);

    const { data: car1, isLoading: isLoading1 } = useQuery({
        queryKey: ["compare-car1", car1Slug],
        queryFn: () => getCarBySlug(car1Slug),
        enabled: !!car1Slug,
    });

    const { data: car2, isLoading: isLoading2 } = useQuery({
        queryKey: ["compare-car2", car2Slug],
        queryFn: () => getCarBySlug(car2Slug),
        enabled: !!car2Slug,
    });

    const { data: compareData } = useQuery({
        queryKey: ["compare-result", car1Slug, car2Slug],
        queryFn: () => compareCars([car1Slug, car2Slug]),
        enabled: !!car1Slug && !!car2Slug,
    });

    const car1Name = car1 ? localize(car1.name, language) : "";
    const car2Name = car2 ? localize(car2.name, language) : "";

    const hasResults =
        !!car1Slug &&
        !!car2Slug &&
        !!compareData &&
        compareData.length > 0 &&
        !!car1 &&
        !!car2;

    return {
        car1Slug,
        car2Slug,
        car1,
        car2,
        car1Name,
        car2Name,
        isLoading1,
        isLoading2,
        compareData,
        hasResults,
        showSearch1,
        showSearch2,
        setCar1Slug,
        setCar2Slug,
        setShowSearch1,
        setShowSearch2,
    };
}
