import type { IContactApiResponse, IContactFormData } from "../../interfaces/IContactApiResponse";
import type { IContactPageApiResponse } from "../../types/contact.types";
import api from "./http";
import { trackContact, trackLead } from "../../utils/analytics";

export async function submitContactForm(data: IContactFormData): Promise<IContactApiResponse> {
  const response = await api.post<IContactApiResponse>("store/contact", data);
  trackContact({ content_name: "Contact Us Message" });
  trackLead({ content_name: "Contact Form Inquiry" });
  return response.data;
}

export async function getContactPageData(): Promise<IContactPageApiResponse> {
  const response = await api.get<IContactPageApiResponse>("store/contact");
  return response.data;
}
