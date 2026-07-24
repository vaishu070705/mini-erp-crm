import api from "./api";

export type ChallanStatus = "Draft" | "Confirmed" | "Cancelled";

export type ChallanItemPayload = {
  product_id: number;
  quantity: number;
};

export type ChallanPayload = {
  customer_id: number;
  status: ChallanStatus;
  created_by?: number;
  items: ChallanItemPayload[];
};

export const getChallans = () => api.get("/challans");

export const getChallan = (id: string | number) => api.get(`/challans/${id}`);

export const createChallan = (payload: ChallanPayload) =>
  api.post("/challans", payload);

export const updateChallan = (id: string | number, payload: ChallanPayload) =>
  api.put(`/challans/${id}`, payload);

export const cancelChallan = (id: string | number) =>
  api.patch(`/challans/${id}/cancel`);

export const deleteChallan = (id: string | number) =>
  api.delete(`/challans/${id}`);
