import type {
    CarOrderWorkSector,
    ICarOrderFormData,
} from "../interfaces/ICarOrderModalProps";

export const EMPTY_CAR_ORDER_FORM: ICarOrderFormData = {
    fullName: "",
    city: "",
    phone: "",
    email: "",
    salary: "",
    workSector: "private_approved",
    obligations: "",
    obligationType: "none",
    otpCode: "",
    otpVerified: false,
    consolidateDebts: false,
    orderType: "finance",
};


export const CAR_ORDER_WORK_SECTORS_LIST: { value: string; labelAr: string; labelEn: string }[] = [
    { value: "private_approved", labelAr: "قطاع خاص معتمد", labelEn: "Approved Private Sector" },
    { value: "government", labelAr: "قطاع حكومي", labelEn: "Government Sector" },
    { value: "semi_government", labelAr: "قطاع شبه حكومي", labelEn: "Semi-Government Sector" },
    { value: "private_unapproved", labelAr: "قطاع خاص غير معتمد", labelEn: "Unapproved Private Sector" },
    { value: "military", labelAr: "عسكري", labelEn: "Military Sector" },
    { value: "retired", labelAr: "متقاعد", labelEn: "Retired" },
    { value: "freelance", labelAr: "أعمال حرة / تجارة", labelEn: "Self-Employed / Business" },
];

export const CAR_ORDER_STATIC_CITIES = [
    "الرياض",
    "جدة",
    "مكة المكرمة",
    "المدينة المنورة",
    "الدمام",
    "الخبر",
    "الظهران",
    "الطائف",
    "بريدة",
    "تبوك",
    "أبها",
    "خميس مشيط",
    "حائل",
    "نجران",
    "الجبيل",
    "ينبع",
    "القطيف",
    "الأحساء",
    "عرعر",
    "سكاكا",
    "جازان",
    "الباحة",
];

export const carOrderFieldCls = [
    "h-[46px] w-full",
    "border border-[#E2E8F0] bg-white px-3.5",
    "text-[14px] text-[#1E293B] font-medium rounded-lg",
    "outline-none",
    "placeholder:text-[#94A3B8]",
    "transition duration-200",
    "focus:border-[#DDBB68] focus:ring-2 focus:ring-[#DDBB68]/20",
].join(" ");

export const carOrderLabelCls =
    "mb-1.5 block text-start text-[13px] font-bold text-[#1E293B]";
