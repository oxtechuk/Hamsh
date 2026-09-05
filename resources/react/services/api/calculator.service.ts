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
  const response = await api.get<IApiResponse<{ otp_enabled: boolean }>>("store/calculator/settings");
  return response.data.data;
}

export async function sendCalculatorOtp(phone: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post<IApiResponse<null>>("store/calculator/otp/send", { phone });
  return { success: true, message: response.data.message || "OTP sent" };
}

export async function verifyCalculatorOtp(phone: string, code: string, name?: string): Promise<{ lead_id?: number }> {
  const response = await api.post<IApiResponse<{ lead_id: number }>>("store/calculator/otp/verify", { phone, code, name });
  return response.data.data;
}

