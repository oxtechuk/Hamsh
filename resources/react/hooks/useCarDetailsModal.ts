import { useState } from "react";
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

    const { data: car, isLoading } = useQuery({
        queryKey: ["car-details-modal", slug],
        queryFn: () => getCarBySlug(slug),
    });

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

    const images = car?.images?.length
        ? car.images
        : car
          ? [car.main_image]
          : [];
    const badge = car
        ? resolveHighlight(car.highlight, i18n.language)
        : undefined;

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
            navigate("/finance-calculator");
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
        car,
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
