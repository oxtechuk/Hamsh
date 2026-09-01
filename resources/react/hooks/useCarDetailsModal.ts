import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getCarBySlug } from "../services/api";
import { SHOW_CAR_DETAILS_AS_MODAL } from "../constants/feature-flags";
import { localize } from "../utils/localize";
import { resolveHighlight } from "../utils/badge-utils";

import type { ISpecItem } from "../interfaces/ICarDetailsSpecsProps";
import type { CarDetailsModalTab } from "../interfaces/ICarDetailsInfoPanelProps";

export function useCarDetailsModal(slug: string, onClose: () => void) {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState<CarDetailsModalTab>("features");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderMode, setOrderMode] = useState<"finance" | "cash">("cash");
    const [selectedTrimIndex, setSelectedTrimIndex] = useState<number>(0);

    const { data: car, isLoading } = useQuery({
        queryKey: ["car-details-modal", slug],
        queryFn: () => getCarBySlug(slug),
    });

    const selectedTrim = useMemo(() => {
        if (!car?.trims || car.trims.length === 0) return null;
        return car.trims[selectedTrimIndex] ?? car.trims[0];
    }, [car?.trims, selectedTrimIndex]);

    const effectiveCar = useMemo(() => {
        if (!car) return car;
        if (!selectedTrim) return car;
        return {
            ...car,
            name: selectedTrim.name ? selectedTrim.name : car.name,
            cash_price: selectedTrim.cash_price || car.cash_price,
            current_price: selectedTrim.cash_price || car.current_price,
            min_installment: selectedTrim.monthly_installment || car.min_installment,
            availability_status: selectedTrim.availability_status || car.availability_status,
        };
    }, [car, selectedTrim]);

    const specRows: ISpecItem[] = (car?.specifications ?? []).map(
        (specification) => ({
            label: localize(specification.name, i18n.language),
            value: localize(specification.value, i18n.language) || "—",
        }),
    );
    const featureRows: ISpecItem[] = (car?.features_list ?? []).map(
        (feature) => ({
            label: localize(feature.name, i18n.language),
            value: localize(feature.value, i18n.language) || "—",
        }),
    );

    const images = useMemo(() => {
        if (!car) return [];
        let list = car.images?.length ? [...car.images] : [car.main_image];
        if (selectedTrim?.image && !list.includes(selectedTrim.image)) {
            list = [selectedTrim.image, ...list];
        }
        return list;
    }, [car, selectedTrim?.image]);

    const badge = car
        ? resolveHighlight(car.highlight, i18n.language)
        : undefined;

    const handleSelectTrim = (index: number) => {
        setSelectedTrimIndex(index);
        const trim = car?.trims?.[index];
        if (trim?.image) {
            const imgIdx = images.findIndex((img) => img === trim.image);
            if (imgIdx !== -1) {
                setActiveImage(imgIdx);
            } else {
                setActiveImage(0);
            }
        }
    };

    const handlePrev = () => {
        if (!images.length) return;
        setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        if (!images.length) return;
        setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleOrder = (mode: "cash" | "finance" = "cash") => {
        setOrderMode(mode);
        if (SHOW_CAR_DETAILS_AS_MODAL) {
            setShowOrderModal(true);
            return;
        }

        onClose();
        if (mode === "finance") {
            navigate("/finance-calculator", { state: { car: effectiveCar } });
        } else {
            navigate(`/cars/${slug}`);
        }
    };

    const handleFinance = () => {
        handleOrder("finance");
    };

    const handleCompare = () => {
        onClose();
        navigate(
            car ? `/compare?slug=${encodeURIComponent(car.slug)}` : "/compare",
        );
    };

    return {
        car: effectiveCar || car,
        rawCar: car,
        selectedTrim,
        selectedTrimIndex,
        handleSelectTrim,
        isLoading,
        activeImage,
        setActiveImage,
        activeTab,
        setActiveTab,
        showOrderModal,
        orderMode,
        specRows,
        featureRows,
        images,
        badge,
        handlePrev,
        handleNext,
        handleOrder,
        handleFinance,
        handleCompare,
    };
}
