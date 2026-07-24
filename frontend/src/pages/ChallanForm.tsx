import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import {
  createChallan,
  getChallan,
  updateChallan,
} from "../services/challan";
import type { ChallanStatus } from "../services/challan";
import { Sidebar, challansStyles } from "./Challans";

type FormItem = {
  product_id: string;
  quantity: string;
};

export default function ChallanForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState<ChallanStatus>("Draft");
  const [items, setItems] = useState<FormItem[]>([
    { product_id: "", quantity: "" },
  ]);

  useEffect(() => {
    fetchOptions();

    if (id) {
      fetchChallan();
    }
  }, [id]);

  const fetchOptions = async () => {
    try {
      const [customerRes, productRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);

      setCustomers(customerRes.data);
      setProducts(productRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load form data");
    }
  };

  const fetchChallan = async () => {
    try {
      const res = await getChallan(id as string);

      if (res.data.status !== "Draft") {
        alert("Only draft challans can be edited");
        navigate(`/challans/${id}`);
        return;
      }

      setCustomerId(String(res.data.customer_id));
      setStatus(res.data.status);
      setItems(
        res.data.items.map((item: any) => ({
          product_id: String(item.product_id),
          quantity: String(item.quantity),
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to load challan");
    }
  };

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [items]
  );

  const updateItem = (index: number, key: keyof FormItem, value: string) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const addItemRow = () => {
    setItems((current) => [...current, { product_id: "", quantity: "" }]);
  };

  const removeItemRow = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const saveChallan = async () => {
    if (!customerId) {
      alert("Please select a customer");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));

    if (!Number.isInteger(userId) || userId <= 0) {
      alert("Logged-in user id is missing. Please login again.");
      navigate("/");
      return;
    }

    const payload = {
      customer_id: Number(customerId),
      status,
      created_by: userId,
      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    };

    try {
      if (id) {
        await updateChallan(id, payload);
      } else {
        await createChallan(payload);
      }

      navigate("/challans");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save challan");
    }
  };

  return (
    <>
      <style>{challansStyles + challanFormStyles}</style>
      <div className="challans-shell">
        <Sidebar active="Sales Challans" />

        <main className="challans-main">
          <section className="challans-header">
            <div>
              <p className="challans-eyebrow">Sales Dispatch</p>
              <h1>{isEditing ? "Edit Challan" : "New Challan"}</h1>
              <p className="challans-subtitle">
                Select a customer, add products, and save as draft or confirmed.
              </p>
            </div>

            <button
              className="challans-primary-button challan-secondary-button"
              onClick={() => navigate("/challans")}
            >
              Back
            </button>
          </section>

          <section className="challan-form-card">
            <div className="challan-form-grid">
              <label className="challan-field">
                <span>Customer</span>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="challan-field">
                <span>Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ChallanStatus)}
                >
                  <option>Draft</option>
                  <option>Confirmed</option>
                </select>
              </label>
            </div>

            <div className="challan-items-header">
              <div>
                <p className="challans-eyebrow">Items</p>
                <h2>Products</h2>
              </div>
              <button className="challan-add-row" onClick={addItemRow}>
                Add Product
              </button>
            </div>

            <div className="challan-items-list">
              {items.map((item, index) => (
                <div className="challan-item-row" key={index}>
                  <label className="challan-field">
                    <span>Product</span>
                    <select
                      value={item.product_id}
                      onChange={(e) =>
                        updateItem(index, "product_id", e.target.value)
                      }
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.product_name} - Stock {product.current_stock}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="challan-field">
                    <span>Quantity</span>
                    <input
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </label>

                  <button
                    className="challan-remove-row"
                    onClick={() => removeItemRow(index)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="challan-form-footer">
              <span>Total Quantity: {totalQuantity}</span>
              <button className="challans-primary-button" onClick={saveChallan}>
                {isEditing ? "Update Challan" : "Save Challan"}
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

const challanFormStyles = `
  .challan-form-card { margin-top: 22px; border: 1px solid rgba(148,163,184,.12); border-radius: 22px; background: rgba(30,41,59,.92); box-shadow: 0 24px 70px rgba(0,0,0,.24); padding: 24px; }
  .challan-form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; }
  .challan-field { display: grid; gap: 8px; }
  .challan-field span { color: #cbd5e1; font-size: 13px; font-weight: 800; }
  .challan-field input, .challan-field select { width: 100%; min-height: 48px; border: 1px solid rgba(148,163,184,.18); border-radius: 14px; outline: 0; padding: 0 14px; background: rgba(15,23,42,.74); color: #fff; }
  .challan-field select option { background: #1e293b; color: #fff; }
  .challan-field input:focus, .challan-field select:focus { border-color: rgba(37,99,235,.8); box-shadow: 0 0 0 4px rgba(37,99,235,.14); }
  .challan-items-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 26px; padding-top: 22px; border-top: 1px solid rgba(148,163,184,.12); }
  .challan-items-header h2 { margin: 0; color: #fff; }
  .challan-add-row, .challan-remove-row, .challan-secondary-button { min-height: 42px; border: 0; border-radius: 12px; padding: 0 14px; color: #fff; cursor: pointer; font-weight: 800; transition: .18s ease; }
  .challan-add-row { background: #22c55e; } .challan-remove-row { background: #ef4444; align-self: end; } .challan-remove-row:disabled { opacity: .45; cursor: not-allowed; }
  .challan-secondary-button { background: #334155; box-shadow: none; }
  .challan-items-list { display: grid; gap: 14px; margin-top: 16px; }
  .challan-item-row { display: grid; grid-template-columns: minmax(220px, 1fr) minmax(140px, 220px) auto; gap: 14px; align-items: end; padding: 16px; border: 1px solid rgba(148,163,184,.12); border-radius: 18px; background: rgba(15,23,42,.32); }
  .challan-form-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(148,163,184,.12); color: #fff; font-weight: 900; }
  @media (max-width: 760px) { .challan-form-grid, .challan-item-row { grid-template-columns: 1fr; } .challan-form-footer, .challan-items-header { flex-direction: column; align-items: stretch; } }
`;
