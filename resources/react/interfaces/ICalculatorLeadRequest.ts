export interface ICalculatorLeadRequest {
  name: string;
  phone: string;
  car_ids?: number[];
  salary?: number;
  city?: string;
  monthly_obligations?: number;
  down_payment?: number;
  last_payment?: number;
  last_payment_percentage?: number;
  period_months?: number;
  monthly_payment?: number;
  car_price?: number;
  annual_rate?: number;
  notes?: string;
  email?: string;
  preferred_bank_id?: number;
}

export interface ICalculatorLeadResponse {
  success: boolean;
  message: string;
  data: { lead_id: number } | null;
  errors: unknown;
  meta: unknown;
}
