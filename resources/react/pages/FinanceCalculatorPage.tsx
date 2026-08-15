import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";

import {
  StepOneForm,
  StepTwoCarSelection,
  StepThreeCalculator,
} from "../components/calculator";

import CalculatorSuccess from "../components/calculator/CalculatorSuccess";
import LazyImg from "../components/LazyImg";

import { getImageUrl, APP_IMAGES } from "../constants/app-images";
import { getCars } from "../services/api";
import { fmt } from "../utils/format";

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

  const sidebarSteps = [
    { number: 1, label: t("financeCalculator.step1.stepperLabel", "بياناتك الشخصية") },
    { number: 2, label: t("financeCalculator.step2.stepperLabel", "اختيار السيارة") },
    { number: 3, label: t("financeCalculator.step3.stepperLabel", "حساب القسط") },
  ];

  return (
    <main dir={i18n.dir()} className="min-h-screen bg-[#F5F4EF]">
      {/* Page header */}
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-3 flex items-center gap-1.5 text-[13px]" aria-label="breadcrumb">
          <Link to="/" className="text-[var(--brand-primary-color)] transition hover:underline">
            {t("breadcrumb.home", "الرئيسية")}
          </Link>
          <span className="text-[#9CA3AF]">{i18n.dir() === "rtl" ? "‹" : "›"}</span>
          <span className="text-[#6B7280]">{t("breadcrumb.calculator", "الحاسبة")}</span>
        </nav>

        {/* Title */}
        <h1 className="text-[34px] font-bold leading-tight text-[#111111] sm:text-[40px]">
          {t("financeCalculator.pageTitle.prefix", "تمويل")}{" "}
          <span className="font-extrabold text-[var(--brand-primary-color)]">
            {t("financeCalculator.pageTitle.suffix", "يناسبك")}
          </span>
        </h1>
      </div>

      {/* Two-column body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row-reverse">

          {/* Sidebar (right in RTL) */}
          {!done && (
            <aside className="w-full shrink-0 lg:w-[300px]">
              <div className="sticky top-6 space-y-4">

                {/* Step checklist */}
                <div className="rounded-[16px] bg-white px-5 py-5 shadow-sm">
                  <p className="mb-4 text-[12px] font-semibold text-[var(--brand-primary-color)]">
                    {t("financeCalculator.sidebar.title", "حاسبة التمويل")}
                  </p>
                  <ul className="space-y-3">
                    {sidebarSteps.map((s) => {
                      const isDone = (step as number) > s.number;
                      const isActive = (step as number) === s.number;
                      return (
                        <li key={s.number} className="flex items-center justify-between gap-3">
                          <span
                            className={[
                              "text-[14px] font-semibold",
                              isActive ? "text-[#111111]" : isDone ? "text-[#111111]" : "text-[#9CA3AF]",
                            ].join(" ")}
                          >
                            {s.label}
                          </span>
                          <span
                            className={[
                              "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] text-[12px] font-bold",
                              isDone
                                ? "bg-[var(--brand-primary-color)] text-white"
                                : isActive
                                  ? "border-2 border-[var(--brand-primary-color)] bg-[var(--brand-primary-color)]/10 text-[var(--brand-primary-color)]"
                                  : "bg-[#F3F4F6] text-[#9CA3AF]",
                            ].join(" ")}
                          >
                            {isDone ? (
                              <Check size={14} strokeWidth={3} />
                            ) : (
                              String(s.number).padStart(2, "0")
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Car preview card (step 2+) */}
                {selectedCarData && (step as number) >= 2 && (
                  <div className="overflow-hidden rounded-[16px] bg-white shadow-sm">
                    <LazyImg
                      src={selectedCar.image}
                      alt={selectedCar.name}
                      className="h-[160px] w-full object-cover"
                    />
                    <div className="px-4 py-4">
                      <p className="text-[12px] text-[var(--brand-primary-color)]">
                        {selectedCar.brand}
                      </p>
                      <p className="text-[15px] font-extrabold text-[#111111]">
                        {selectedCar.name}
                      </p>
                      {selectedCar.price > 0 && (
                        <div className="mt-2">
                          <p className="text-[11px] text-[#9CA3AF]">
                            {t("financeCalculator.sidebar.estimatedInstallment", "القسط التقريبي")}
                          </p>
                          <p className="text-[18px] font-extrabold text-[#111111]">
                            {fmt(selectedCar.price)}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF]">
                            {t("financeCalculator.sidebar.riyalPerMonth", "ريال / شهر")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </aside>
          )}

          {/* Main form area */}
          <div className="min-w-0 flex-1">
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

        </div>
      </div>
    </main>
  );
}
