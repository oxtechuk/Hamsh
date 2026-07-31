import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  StepOneForm,
  StepTwoCarSelection,
  StepThreeCalculator,
} from "../components/calculator";

import Stepper from "../components/calculator/Stepper";
import CalculatorSuccess from "../components/calculator/CalculatorSuccess";

import { getImageUrl, APP_IMAGES } from "../constants/app-images";
import { getCars } from "../services/api";

import type { CarItem } from "../types/home.types";
import type { ISelectedCar } from "../interfaces/ISelectedCar";
import type { IPersonalInfo } from "../interfaces/IPersonalInfo";
import type { IStepperStep } from "../interfaces/IStepperProps";

import { useSEO } from "../utils/useSEO";
import { localize } from "../utils/localize";

export default function FinanceCalculatorPage() {
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useSEO(
    t("pageTitles.financeCalculator"),
    t("financeCalculator.description"),
  );

  const preSelectedCar = (location.state as { car?: CarItem } | null)?.car ?? null;

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

  return (
    <main dir={i18n.dir()} className="min-h-screen ">
      {/* Dark hero */}
      <section
        dir={i18n.dir()}
        className="relative w-full overflow-hidden bg-[#0A0A0A] px-4 py-10 sm:py-14"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-[13px] font-semibold text-[#C5232B]">
            {t("financeCalculator.badge", "حاسبة الأقساط")}
          </p>
          <h1 className="text-[32px] font-extrabold leading-tight text-white sm:text-[42px]">
            {t("financeCalculator.titleWhite", "احسب قسطك بكل سهولة")}
          </h1>
          <p className="mt-3 text-[14px] text-white/50">
            {t("financeCalculator.description", "خطوات بسيطة للحصول على تمويل يناسبك")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {!done && (
            <div className="mb-10">
              <Stepper activeStep={step} />
            </div>
          )}

          {done ? (
            <CalculatorSuccess
              carLabel={`${selectedCar.brand} ${selectedCar.name}`.trim()}
              clientPhone={personalInfo?.phone ?? ""}
            />
          ) : step === 1 ? (
            <StepOneForm
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
      </section>
    </main>
  );
}
