import { useState, useEffect } from "react";
import { ShieldCheck, Smartphone, X, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { sendCalculatorOtp, verifyCalculatorOtp } from "../../services/api";

interface OtpModalProps {
  isOpen: boolean;
  phone: string;
  onClose: () => void;
  onVerified: () => void;
}

export default function OtpModal({ isOpen, phone, onClose, onVerified }: OtpModalProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (isOpen && phone && !otpSent && !isSending) {
      handleSendOtp();
    }
  }, [isOpen, phone]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!phone) {
      toast.error(t("financeCalculator.otp.invalidPhone", "رقم الجوال غير صحيح"));
      return;
    }
    setIsSending(true);
    try {
      const res = await sendCalculatorOtp(phone);
      if (res.success) {
        setOtpSent(true);
        setCountdown(60);
        toast.success(res.message || t("financeCalculator.otp.sentSuccess", "تم إرسال رمز التحقق لرقم جوالك"));
      } else {
        toast.error(res.message || t("financeCalculator.otp.sendFailed", "فشل إرسال رمز التحقق"));
      }
    } catch {
      toast.error(t("financeCalculator.otp.sendError", "حدث خطأ أثناء إرسال رمز التحقق"));
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code.trim() || code.length < 4) {
      toast.error(t("financeCalculator.otp.enterCode", "يرجى إدخال رمز التحقق المكون من 6 أرقام"));
      return;
    }
    setIsVerifying(true);
    try {
      const res = await verifyCalculatorOtp(phone, code);
      if (res.success) {
        toast.success(t("financeCalculator.otp.verifiedSuccess", "تم تأكيد رقم الجوال بنجاح"));
        onVerified();
      } else {
        toast.error(res.message || t("financeCalculator.otp.invalidCode", "رمز التحقق غير صحيح أو منتهي الصلاحية"));
      }
    } catch {
      toast.error(t("financeCalculator.otp.verifyError", "فشل التحقق من الرمز، حاول مرة أخرى"));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#C5232B]">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {t("financeCalculator.otp.title", "تأكيد رقم الجوال")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("financeCalculator.otp.subtitle", "يرجى تأكيد رقم الجوال لاستكمال طلب التمويل")}
          </p>
        </div>

        <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
          <span className="text-xs text-gray-400 block mb-1">
            {t("financeCalculator.otp.phoneLabel", "رقم الجوال")}
          </span>
          <div className="flex items-center justify-center gap-2 font-mono text-base font-bold text-gray-800 dir-ltr">
            <Smartphone size={18} className="text-gray-400" />
            {phone}
          </div>
        </div>

        {!otpSent ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5232B] py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-[#A91D24] disabled:opacity-50"
            >
              {isSending
                ? t("financeCalculator.otp.sending", "جارٍ إرسال الرمز...")
                : t("financeCalculator.otp.sendButton", "إرسال رمز التحقق")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {t("financeCalculator.otp.codeLabel", "أدخل رمز التحقق (OTP)")}
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-xl font-bold tracking-widest text-gray-900 focus:border-[#C5232B] focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying || !code.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5232B] py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-[#A91D24] disabled:opacity-50"
            >
              {isVerifying
                ? t("financeCalculator.otp.verifying", "جارٍ التحقق...")
                : t("financeCalculator.otp.verifyButton", "تأكيد الرمز واستكمال الطلب")}
            </button>

            <div className="text-center pt-2">
              {countdown > 0 ? (
                <p className="text-xs text-gray-400">
                  {t("financeCalculator.otp.resendIn", "يمكنك إعادة طلب الرمز خلال")}{" "}
                  <span className="font-bold text-gray-700">{countdown}</span> {t("financeCalculator.otp.seconds", "ثانية")}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5232B] hover:underline"
                >
                  <RotateCcw size={14} />
                  {t("financeCalculator.otp.resendButton", "إعادة إرسال الرمز")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
