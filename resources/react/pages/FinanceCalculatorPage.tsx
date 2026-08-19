import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  StepOneForm,
  StepTwoCarSelection,
  StepThreeCalculator,
} from "../components/calculator";

import CalculatorSuccess from "../components/calculator/CalculatorSuccess";
import CalculatorSidebar from "../components/calculator/CalculatorSidebar";

import { getImageUrl, APP_IMAGES } from "../constants/app-images";
import { getCars } from "../services/api";

import type { CarItem } from "../types/home.types";
import type { ISelectedCar } from "../interfaces/ISelectedCar";
import type { IPersonalInfo } from "../interfaces/IPersonalInfo";
import type { IStepperStep } from "../interfaces/IStepperProps";
import type { IFinanceCalculatorPageLocationState } from "../interfaces/IFinanceCalculatorPageLocationState";

import { useSEO } from "../utils/useSEO";
import { localize } from "../utils/localize";

export default function FinanceCalculatorPage() {
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useSEO(
    t("pageTitles.financeCalculator"),
    t("financeCalculator.description"),
  );

  const preSelectedCar =
    (location.state as IFinanceCalculatorPageLocationState | null)?.car ?? null;

  const [step, setStep] = useState<IStepperStep>(1);
  const [done, setDone] = useState(false);
  const [selectedCarData, setSelectedCarData] = useState<CarItem | null>(preSelectedCar);
  const [selectedCarId, setSelectedCarId] = useState(preSelectedCar?.id ?? 0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [term, setTerm] = useState(48);
  const [personalInfo, setPersonalInfo] = useState<IPersonalInfo | null>(null);

  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ["calculator-cars"],
    queryFn: () => getCars(),
    staleTime: 5 * 60 * 1000,
  });
  const cars = carsData?.data ?? [];

  const selectedCar: ISelectedCar = useMemo(() => {
    if (!selectedCarData) {
      return { id: 0, brand: "", name: "", model: "", price: 0, tag: "", image: "" };
    }
    return {
      id: selectedCarData.id,
      brand: localize(selectedCarData.brand?.name, i18n.language),
      name: localize(selectedCarData.name, i18n.language),
      model: String(selectedCarData.year ?? ""),
      price: selectedCarData.current_price,
      tag: "",
      image: getImageUrl(selectedCarData.main_image) ?? APP_IMAGES.CAR_PLACEHOLDER,
    };
  }, [selectedCarData, i18n.language]);

  const sidebarCarData = selectedCarData
    ? {
        image: getImageUrl(selectedCarData.main_image) ?? APP_IMAGES.CAR_PLACEHOLDER,
        name: localize(selectedCarData.name, i18n.language),
        brand: localize(selectedCarData.brand?.name, i18n.language),
        price: selectedCarData.current_price,
      }
    : null;

  return (
    <main dir={i18n.dir()} className="min-h-screen bg-[#F5F4EF]">
      {!done && (
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8 mb-6">
          <nav className="mb-3 flex items-center gap-1.5 text-[13px]" aria-label="breadcrumb">
            <Link to="/" className="text-[var(--brand-primary-color)] transition hover:underline">
              {t("financeCalculator.breadcrumb.home")}
            </Link>
            <span className="text-[#9CA3AF]">{i18n.dir() === "rtl" ? "\u2039" : "\u203A"}</span>
            <span className="text-[var(--brand-primary-color)]">{t("financeCalculator.breadcrumb.calculator")}</span>
          </nav>

          <h1 className="text-[34px] font-bold leading-tight text-[#111111] sm:text-[40px]">
            {t("financeCalculator.titleWhite")}{" "}
            <span className="font-extrabold text-[var(--brand-primary-color)]">
              {t("financeCalculator.titleOrange")}
            </span>
          </h1>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row-reverse">
          <div className="min-w-0 lg:w-3/5 flex-1">
            {done ? (
              <CalculatorSuccess
                carLabel={`${selectedCar.brand} ${selectedCar.name}`.trim()}
                clientPhone={personalInfo?.phone ?? ""}
              />
            ) : step === 1 ? (
              <StepOneForm
                initialInfo={personalInfo}
                onNext={(info: IPersonalInfo) => {
                  setPersonalInfo(info);
                  setStep(2);
                }}
              />
            ) : step === 2 ? (
              <StepTwoCarSelection
                cars={cars}
                isLoading={carsLoading}
                selectedCarId={selectedCarId}
                onCarSelect={(car) => {
                  setSelectedCarId(car.id);
                  setSelectedCarData(car);
                }}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            ) : personalInfo && selectedCarData ? (
              <StepThreeCalculator
                selectedCar={selectedCar}
                downPaymentPercent={downPaymentPercent}
                setDownPaymentPercent={setDownPaymentPercent}
                term={term}
                setTerm={setTerm}
                personalInfo={personalInfo}
                onBack={() => setStep(2)}
                onSuccess={() => setDone(true)}
              />
            ) : null}
          </div>

          {!done && (
            <CalculatorSidebar step={step} selectedCarData={sidebarCarData} />
          )}
        </div>
      </div>
    </main>
  );
}
