import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DriveStepper from "../components/drive/DriveStepper";
import DriveSuccess from "../components/drive/DriveSuccess";

import { getCars } from "../services/api";
import { localize } from "../utils/localize";

import type { CarItem } from "../types/home.types";
import DriveStepOne from "../components/drive/DriveStepOne";
import DriveStepTwo from "../components/drive/DriveStepTwo";

export interface IDrivePersonalInfo {
    fullName: string;
    phone: string;
    city: string;
    salary: string;
    obligations: string;
}

const EMPTY_PERSONAL: IDrivePersonalInfo = {
    fullName: "",
    phone: "",
    city: "",
    salary: "",
    obligations: "",
};

export default function DrivePage() {
    const { t, i18n } = useTranslation();

    const [step, setStep] = useState<1 | 2>(1);
    const [done, setDone] = useState(false);

    const [personal, setPersonal] =
        useState<IDrivePersonalInfo>(EMPTY_PERSONAL);

    const [selectedCar, setSelectedCar] = useState<CarItem | null>(null);

    const { data: carsResponse, isLoading } = useQuery({
        queryKey: ["drive-cars", i18n.language],
        queryFn: () => getCars(),
        staleTime: 5 * 60 * 1000,
    });

    const cars = carsResponse?.data ?? [];

    const selectedCarLabel = selectedCar
        ? `${localize(selectedCar.brand?.name, i18n.language)} ${localize(
              selectedCar.name,
              i18n.language,
          )}`.trim()
        : "";

    return (
        <main
            dir={i18n.dir()}
            className="min-h-screen w-full bg-[var(--background)]"
        >
            {/* Header */}
            {!done && (
                <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 lg:px-10">
                    <nav
                        aria-label="breadcrumb"
                        className="flex items-center gap-2 text-[11px]"
                    >
                        <Link
                            to="/"
                            className="font-medium text-[#303A54] transition hover:text-[var(--brand-primary-color)]"
                        >
                            {t("breadcrumb.home", "الرئيسية")}
                        </Link>

                        <span className="text-[#8B909A]">
                            {i18n.dir() === "rtl" ? "‹" : "›"}
                        </span>

                        <span className="text-[var(--brand-primary-color)]">
                            {t("drivePage.breadcrumb", "تجربة قيادة")}
                        </span>
                    </nav>

                    <h1 className="mt-3 text-start text-[30px] font-extrabold leading-tight text-[#20283A] sm:text-[36px]">
                        <span>{t("drivePage.title.prefix", "طلب")}</span>{" "}
                        <span className="text-[var(--brand-primary-color)]">
                            {t("drivePage.title.highlight", "تجربة قيادة")}
                        </span>
                    </h1>
                </div>
            )}

            {/* Body */}
            <section className="w-full pb-16 pt-10 sm:pt-12">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    {done ? (
                        <DriveSuccess
                            carLabel={selectedCarLabel}
                            clientPhone={personal.phone}
                        />
                    ) : (
                        <div
                            className={[
                                "grid grid-cols-1 items-start gap-10",
                                "lg:grid-cols-[minmax(0,650px)_330px]",
                                "lg:justify-center lg:gap-14",
                            ].join(" ")}
                        >
                            {/* Form area */}
                            <div className="min-w-0">
                                {step === 1 ? (
                                    <DriveStepOne
                                        data={personal}
                                        onChange={(key, value) =>
                                            setPersonal((previous) => ({
                                                ...previous,
                                                [key]: value,
                                            }))
                                        }
                                        onNext={() => setStep(2)}
                                    />
                                ) : (
                                    <DriveStepTwo
                                        cars={cars}
                                        isLoading={isLoading}
                                        selectedCar={selectedCar}
                                        onCarSelect={setSelectedCar}
                                        onBack={() => setStep(1)}
                                        onSubmit={() => {
                                            if (!selectedCar) return;

                                            setDone(true);
                                        }}
                                    />
                                )}
                            </div>

                            {/* Right sidebar */}
                            <aside className="w-full">
                                <div
                                    className={[
                                        "min-h-[470px] bg-white",
                                        "px-8 py-10",
                                        "lg:sticky lg:top-[100px]",
                                    ].join(" ")}
                                >
                                    <DriveStepper activeStep={step} />

                                    {/* Selected car preview */}
                                    {selectedCar && step === 2 && (
                                        <div className="mt-20">
                                            <img
                                                src={
                                                    selectedCar.main_image
                                                        ? `/storage/${selectedCar.main_image}`
                                                        : ""
                                                }
                                                alt={selectedCarLabel}
                                                className="h-[145px] w-full object-cover"
                                            />

                                            <div className="bg-[#F7F3EB] px-4 py-4 text-start">
                                                <p className="text-[10px] text-[var(--brand-primary-color)]">
                                                    {localize(
                                                        selectedCar.brand?.name,
                                                        i18n.language,
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[13px] font-extrabold text-[#20283A]">
                                                    {localize(
                                                        selectedCar.name,
                                                        i18n.language,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
