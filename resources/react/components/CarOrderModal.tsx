import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X, CreditCard, Banknote } from "lucide-react";

import CarOrderFinanceForm from "./car-order/CarOrderFinanceForm";
import CarOrderCashForm from "./car-order/CarOrderCashForm";
import CarOrderSuccess from "./car-order/CarOrderSuccess";
import { useCarOrderForm } from "../hooks/useCarOrderForm";
import { localize } from "../utils/localize";
import { useLanguageStore } from "../store/language.store";

import type { ICarOrderModalProps } from "../interfaces/ICarOrderModalProps";

export default function CarOrderModal({
    car,
    onClose,
    initialMode = "finance",
}: ICarOrderModalProps) {
    const { t, i18n } = useTranslation();
    const direction = useLanguageStore((state) => state.direction);
    const isRTL = i18n.dir() === "rtl";

    const {
        mode,
        setMode,
        done,
        submitting,
        otpEnabled,
        sendingOtp,
        verifyingOtp,
        otpSent,
        otpVerified,
        form,
        cityOptions,
        setField,
        handleSendOtp,
        handleVerifyOtp,
        canSubmitCash,
        canSubmitFinance,
        dbrAnalysis,
        handleFormSubmit,
    } = useCarOrderForm(car, initialMode);

    const carName = localize(car.name, i18n.language);
    const brandName = localize(car.brand?.name, i18n.language);

    return createPortal(
        <div
            dir={direction}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[480px] sm:max-w-[500px]"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Modal Container */}
                <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                    {/* Top Header Banner */}
                    <div className="relative flex items-center justify-between border-b border-gray-100 bg-[#20283A] px-5 py-3.5 text-white">
                        <div className="text-start">
                            <p className="text-[11px] font-medium text-white/70">
                                {brandName} {car.year ? `· ${car.year}` : ""}
                            </p>
                            <h3 className="text-[15px] sm:text-[16px] font-extrabold text-white line-clamp-1">
                                {mode === "finance"
                                    ? isRTL ? `طلب تمويل - ${carName}` : `Finance Application - ${carName}`
                                    : isRTL ? `طلب شراء نقدي (كاش) - ${carName}` : `Cash Purchase - ${carName}`}
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={t("common.close")}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                        {done ? (
                            <CarOrderSuccess
                                fullName={form.fullName}
                                carLabel={carName}
                                onClose={onClose}
                            />
                        ) : (
                            <>
                                {/* Mode Selector Tabs */}
                                <div className="mb-4 flex rounded-xl bg-gray-100 p-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("finance");
                                            setField("orderType", "finance");
                                        }}
                                        className={[
                                            "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                                            mode === "finance"
                                                ? "bg-white text-[#20283A] shadow-xs"
                                                : "text-gray-500 hover:text-gray-900",
                                        ].join(" ")}
                                    >
                                        <CreditCard size={14} className="text-[#FF4D5A]" />
                                        <span>{isRTL ? "طلب تمويل سيارة" : "Finance Application"}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("cash");
                                            setField("orderType", "cash");
                                        }}
                                        className={[
                                            "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                                            mode === "cash"
                                                ? "bg-white text-[#20283A] shadow-xs"
                                                : "text-gray-500 hover:text-gray-900",
                                        ].join(" ")}
                                    >
                                        <Banknote size={14} className="text-emerald-600" />
                                        <span>{isRTL ? "شراء نقدي (كاش)" : "Cash Purchase"}</span>
                                    </button>
                                </div>

                                {mode === "finance" ? (
                                    <CarOrderFinanceForm
                                        form={form}
                                        cityOptions={cityOptions}
                                        dbrAnalysis={dbrAnalysis}
                                        otpEnabled={otpEnabled}
                                        sendingOtp={sendingOtp}
                                        verifyingOtp={verifyingOtp}
                                        otpSent={otpSent}
                                        otpVerified={otpVerified}
                                        onSendOtp={handleSendOtp}
                                        onVerifyOtp={handleVerifyOtp}
                                        canSubmit={canSubmitFinance}
                                        submitting={submitting}
                                        onFieldChange={setField}
                                        onSubmit={handleFormSubmit}
                                    />
                                ) : (
                                    <CarOrderCashForm
                                        form={form}
                                        cityOptions={cityOptions}
                                        canSubmit={canSubmitCash}
                                        submitting={submitting}
                                        onFieldChange={setField}
                                        onSubmit={handleFormSubmit}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
