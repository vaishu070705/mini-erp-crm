import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChallan } from "../services/challan";
import {
  Sidebar,
  challansStyles,
  formatDate,
  getStatusClass,
} from "./Challans";

export default function ChallanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challan, setChallan] = useState<any>(null);

  useEffect(() => {
    fetchChallan();
  }, [id]);

  const fetchChallan = async () => {
    try {
      const res = await getChallan(id as string);
      setChallan(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load challan");
    }
  };

  return (
    <>
      <style>{challansStyles + challanDetailsStyles}</style>
      <div className="challans-shell">
        <Sidebar active="Sales Challans" />

        <main className="challans-main">
          <section className="challans-header">
            <div>
              <p className="challans-eyebrow">Sales Challan</p>
              <h1>{challan?.challan_number || "Challan Details"}</h1>
              <p className="challans-subtitle">
                Review customer, item snapshots, and challan status.
              </p>
            </div>

            <div className="challan-details-actions">
              {challan?.status === "Draft" && (
                <button
                  className="challans-primary-button"
                  onClick={() => navigate(`/challans/${id}/edit`)}
                >
                  Edit Draft
                </button>
              )}
              <button
                className="challans-primary-button challan-back-button"
                onClick={() => navigate("/challans")}
              >
                Back
              </button>
            </div>
          </section>

          {challan && (
            <>
              <section className="challan-details-grid">
                <article className="challan-detail-card">
                  <p className="challans-eyebrow">Customer</p>
                  <h2>{challan.customer_name}</h2>
                  <div className="challan-detail-list">
                    <span>Mobile: {challan.mobile || "-"}</span>
                    <span>Email: {challan.email || "-"}</span>
                    <span>Business: {challan.business_name || "-"}</span>
                  </div>
                </article>

                <article className="challan-detail-card">
                  <p className="challans-eyebrow">Summary</p>
                  <h2>{challan.total_quantity} items</h2>
                  <div className="challan-detail-list">
                    <span>
                      Status:{" "}
                      <strong className={`challans-status ${getStatusClass(challan.status)}`}>
                        {challan.status}
                      </strong>
                    </span>
                    <span>Created By: {challan.created_by || "System"}</span>
                    <span>Created At: {formatDate(challan.created_at)}</span>
                  </div>
                </article>
              </section>

              <section className="challans-card">
                <div className="challans-table-wrap">
                  <table className="challans-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {challan.items.map((item: any) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.sku || "-"}</td>
                          <td>Rs. {item.unit_price}</td>
                          <td>{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}

const challanDetailsStyles = `
  .challan-details-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .challan-back-button { background: #334155; box-shadow: none; }
  .challan-details-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; margin-top: 22px; }
  .challan-detail-card { border: 1px solid rgba(148,163,184,.12); border-radius: 22px; background: rgba(30,41,59,.92); box-shadow: 0 24px 70px rgba(0,0,0,.24); padding: 24px; }
  .challan-detail-card h2 { margin: 0; color: #fff; font-size: 26px; }
  .challan-detail-list { display: grid; gap: 10px; margin-top: 18px; color: #cbd5e1; font-weight: 700; }
  @media (max-width: 760px) { .challan-details-grid { grid-template-columns: 1fr; } .challan-details-actions { flex-direction: column; } }
`;
