import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X, CreditCard, Banknote } from "lucide-react";

import CarOrderSummaryPanel from "./car-order/CarOrderSummaryPanel";
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
        form,
        cityOptions,
        setField,
        canSubmitCash,
        canSubmitFinance,
        dbrAnalysis,
        handleFormSubmit,
    } = useCarOrderForm(car, initialMode);

    return createPortal(
        <div
            dir={direction}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[920px]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t("common.close")}
                    className="absolute start-0 -top-12 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#20283A] shadow-md transition hover:bg-[#F0EEE8] cursor-pointer"
                >
                    <X size={18} />
                </button>

                <div className="grid max-h-[90vh] w-full grid-cols-1 overflow-y-auto rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:grid-cols-12 overflow-hidden">
                    {/* Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <CarOrderSummaryPanel
                            car={car}
                            step={mode === "finance" ? 2 : 1}
                            done={done}
                            steps={[
                                {
                                    number: 1,
                                    label: isRTL ? "شراء نقدي مباشر" : "Cash Purchase",
                                    icon: Banknote,
                                },
                                {
                                    number: 2,
                                    label: isRTL ? "تمويل وحساب الإمكانية" : "Finance & Eligibility",
                                    icon: CreditCard,
                                },
                            ]}
                        />
                    </div>

                    {/* Main Form Area */}
                    <div className="order-2 flex flex-col p-6 lg:p-8 bg-white lg:col-span-7">
                        {done ? (
                            <CarOrderSuccess
                                fullName={form.fullName}
                                carLabel={localize(car.name, i18n.language)}
                                onClose={onClose}
                            />
                        ) : (
                            <>
                                {/* Mode Selector Tabs */}
                                <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("finance");
                                            setField("orderType", "finance");
                                        }}
                                        className={[
                                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer",
                                            mode === "finance"
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500 hover:text-gray-900",
                                        ].join(" ")}
                                    >
                                        <CreditCard size={16} className={mode === "finance" ? "text-[#C81E1E]" : ""} />
                                        <span>{isRTL ? "طلب تمويل سيارة" : "Finance Application"}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("cash");
                                            setField("orderType", "cash");
                                        }}
                                        className={[
                                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer",
                                            mode === "cash"
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500 hover:text-gray-900",
                                        ].join(" ")}
                                    >
                                        <Banknote size={16} className={mode === "cash" ? "text-[#DDBB68]" : ""} />
                                        <span>{isRTL ? "شراء نقدي (كاش)" : "Cash Purchase"}</span>
                                    </button>
                                </div>

                                {mode === "finance" ? (
                                    <CarOrderFinanceForm
                                        form={form}
                                        cityOptions={cityOptions}
                                        dbrAnalysis={dbrAnalysis}
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
