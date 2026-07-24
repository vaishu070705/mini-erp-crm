export type ChallanStatus = "Draft" | "Confirmed" | "Cancelled";

export type ChallanItemInput = {
  product_id: number;
  quantity: number;
};

export type ChallanInput = {
  customer_id: number;
  status: ChallanStatus;
  created_by?: number;
  items: ChallanItemInput[];
};

export type ChallanUpdateInput = {
  customer_id: number;
  status: ChallanStatus;
  items: ChallanItemInput[];
};

export type ChallanRow = {
  id: number;
  challan_number: string;
  customer_id: number;
  customer_name?: string;
  status: ChallanStatus;
  total_quantity: number;
  created_by: number | null;
  created_at: string;
  updated_at?: string;
};

export type ChallanItemRow = {
  id: number;
  challan_id: number;
  product_id: number;
  product_name: string;
  sku: string | null;
  unit_price: number;
  quantity: number;
  created_at?: string;
};
