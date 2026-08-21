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
    workSector: "",
    obligations: "",
};

export const CAR_ORDER_WORK_SECTORS: CarOrderWorkSector[] = [
    "government",
    "private",
    "retired",
    "freelance",
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
    "h-[48px] w-full",
    "border-0 bg-white px-4",
    "text-[13px] text-[#303A54] font-regular!",
    "outline-none",
    "shadow-[0_6px_18px_rgba(48,58,84,0.06)]",
    "placeholder:text-[#A8ABB2]",
    "transition duration-300",
    "focus:ring-1 focus:ring-[var(--brand-primary-color)]",
].join(" ");

export const carOrderLabelCls =
    "mb-2 block text-start text-[12px] font-bold text-[#404E6A]";
