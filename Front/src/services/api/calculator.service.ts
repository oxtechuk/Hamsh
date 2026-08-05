import type { ICalculatorLeadRequest, ICalculatorLeadResponse } from "../../interfaces/ICalculatorLeadRequest";
import type { IBankItem, ICalculateRequest, ICalculateData, IApiResponse } from "../../interfaces/ICalculatorTypes";
import api from "./http";

export async function submitCalculatorLead(data: ICalculatorLeadRequest): Promise<ICalculatorLeadResponse> {
  const response = await api.post<ICalculatorLeadResponse>("store/calculator/lead", data);
  return response.data;
}

export async function getBanks(): Promise<IBankItem[]> {
  const response = await api.get<IApiResponse<IBankItem[]>>("store/calculator/banks");
  return response.data.data;
}

export async function calculateFinance(data: ICalculateRequest): Promise<ICalculateData> {
  const response = await api.post<IApiResponse<ICalculateData>>("store/calculator/calculate", data);
  return response.data.data;
}

export async function getCalculatorSettings(): Promise<{ otp_enabled: boolean }> {
  try {
    const response = await api.get<IApiResponse<{ otp_enabled: boolean }>>("store/calculator/settings");
    return response.data.data ?? { otp_enabled: false };
  } catch {
    return { otp_enabled: false };
  }
}

export async function sendCalculatorOtp(phone: string): Promise<{ success: boolean; message?: string }> {
  const response = await api.post<IApiResponse<null>>("store/calculator/otp/send", { phone });
  return {
    success: response.data.success ?? true,
    message: response.data.message,
  };
}

export async function verifyCalculatorOtp(phone: string, code: string): Promise<{ success: boolean; message?: string }> {
  const response = await api.post<IApiResponse<null>>("store/calculator/otp/verify", { phone, code });
  return {
    success: response.data.success ?? true,
    message: response.data.message,
  };
}
