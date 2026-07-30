import type { IBookingApiResponse } from "../../interfaces/IBookingApiResponse";
import api from "./http";

export async function submitBooking(data: Record<string, unknown>): Promise<IBookingApiResponse> {
  const response = await api.post<IBookingApiResponse>("store/booking", data);
  return response.data;
}
