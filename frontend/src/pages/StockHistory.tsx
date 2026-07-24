import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { canAccessNav } from "../utils/auth";

export default function StockHistory() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [movements, setMovements] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [movementType, setMovementType] = useState("All");

  const fetchMovements = async () => {
    try {
      const url = productId
        ? `/stock-movements/${productId}`
        : "/stock-movements";
      const res = await api.get(url);
      setMovements(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stock history");
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [productId]);

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      movement.reason?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      movementType === "All" || movement.movement_type === movementType;

    return matchesSearch && matchesType;
  });

  return (
    <>
      <style>{stockHistoryStyles}</style>

      <div className="stock-shell">
        <aside className="stock-sidebar">
          <div>
            <div className="stock-brand">
              <span className="stock-brand-mark">M</span>
              <div>
                <h2>Mini ERP</h2>
                <p>CRM Admin</p>
              </div>
            </div>

            <nav className="stock-nav" aria-label="Main navigation">
              {[
                ["Dashboard", "/dashboard"],
                ["Customers", "/customers"],
                ["Products", "/products"],
                ["Orders", "/orders"],
                ["Sales Challans", "/sales-challans"],
                ["Stock History", "/stock-history"],
              ].filter(([label]) => canAccessNav(label)).map(([label, path]) => (
                <button
                  key={path}
                  className={`stock-nav-button${
                    label === "Products" ? " active" : ""
                  }`}
                  onClick={() => navigate(path)}
                >
                  <span className="stock-nav-icon">•</span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            className="stock-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <span className="stock-nav-icon">•</span>
            <span>Logout</span>
          </button>
        </aside>

        <main className="stock-main">
          <section className="stock-header">
            <div>
              <p className="stock-eyebrow">Inventory Audit</p>
              <h1>Stock History</h1>
              <p className="stock-subtitle">
                Track every automatic stock movement created from product stock
                changes.
              </p>
            </div>

            <button className="stock-primary-button" onClick={() => navigate("/products")}>
              Back to Products
            </button>
          </section>

          <section className="stock-toolbar">
            <input
              className="stock-search"
              placeholder="Search product or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="stock-filter"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
            >
              <option>All</option>
              <option>IN</option>
              <option>OUT</option>
            </select>
          </section>

          <section className="stock-card">
            <div className="stock-table-wrap">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMovements.length > 0 ? (
                    filteredMovements.map((movement) => (
                      <tr key={movement.id}>
                        <td>{formatDate(movement.created_at)}</td>
                        <td>{movement.product_name || "-"}</td>
                        <td>
                          <span
                            className={`stock-badge ${
                              movement.movement_type === "IN"
                                ? "stock-in"
                                : "stock-out"
                            }`}
                          >
                            {movement.movement_type}
                          </span>
                        </td>
                        <td>{movement.quantity}</td>
                        <td>{movement.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="stock-empty" colSpan={5}>
                        No stock movements found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN");
}

const stockHistoryStyles = `
  .stock-shell { width: 100vw; min-height: 100vh; margin-left: calc((100% - 100vw) / 2); display: flex; color: #f8fafc; background: radial-gradient(circle at top right, rgba(37,99,235,.22), transparent 34rem), #0f172a; text-align: left; }
  .stock-sidebar { position: fixed; inset: 0 auto 0 0; width: 280px; background: rgba(17,24,39,.98); border-right: 1px solid rgba(148,163,184,.14); padding: 24px 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 20px 0 45px rgba(0,0,0,.24); z-index: 10; }
  .stock-brand { display: flex; align-items: center; gap: 14px; padding: 8px 8px 28px; } .stock-brand-mark { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: linear-gradient(135deg,#2563eb,#8b5cf6); color: #fff; font-weight: 900; }
  .stock-brand h2, .stock-brand p, .stock-header h1, .stock-header p { margin: 0; } .stock-brand h2 { color: #fff; font-size: 20px; } .stock-brand p { color: #94a3b8; font-size: 13px; }
  .stock-nav { display: flex; flex-direction: column; gap: 10px; } .stock-nav-button, .stock-logout { width: 100%; min-height: 48px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: #cbd5e1; display: flex; align-items: center; gap: 12px; padding: 0 14px; cursor: pointer; font: inherit; font-weight: 700; transition: .18s ease; }
  .stock-nav-button:hover, .stock-logout:hover { transform: translateX(4px); background: rgba(30,41,59,.95); color: #fff; } .stock-nav-button.active { background: linear-gradient(135deg,rgba(37,99,235,.95),rgba(139,92,246,.9)); color: #fff; }
  .stock-logout { color: #fecaca; background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.16); } .stock-nav-icon { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,.1); }
  .stock-main { width: 100%; min-width: 0; margin-left: 280px; padding: 34px; animation: stockFade .42s ease both; }
  .stock-header { border: 1px solid rgba(148,163,184,.12); border-radius: 24px; padding: 30px; background: linear-gradient(135deg,rgba(30,41,59,.96),rgba(15,23,42,.78)); box-shadow: 0 24px 70px rgba(0,0,0,.24); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .stock-eyebrow { margin-bottom: 10px; color: #93c5fd; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; } .stock-header h1 { color: #fff; font-size: clamp(34px,5vw,54px); line-height: 1.02; letter-spacing: 0; } .stock-subtitle { margin-top: 12px; color: #cbd5e1; line-height: 1.6; }
  .stock-primary-button { min-height: 48px; border: 0; border-radius: 14px; padding: 0 20px; color: #fff; background: #2563eb; cursor: pointer; font-weight: 800; box-shadow: 0 16px 32px rgba(37,99,235,.32); transition: .18s ease; } .stock-primary-button:hover { transform: translateY(-2px); }
  .stock-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-top: 22px; } .stock-search, .stock-filter { min-height: 50px; border: 1px solid rgba(148,163,184,.18); border-radius: 16px; background: rgba(30,41,59,.92); color: #fff; box-shadow: 0 18px 42px rgba(0,0,0,.18); outline: 0; } .stock-search { width: min(100%, 460px); padding: 0 16px; } .stock-filter { padding: 0 14px; } .stock-filter option { background: #1e293b; }
  .stock-card { margin-top: 22px; border: 1px solid rgba(148,163,184,.12); border-radius: 22px; background: rgba(30,41,59,.92); box-shadow: 0 24px 70px rgba(0,0,0,.24); overflow: hidden; } .stock-table-wrap { width: 100%; overflow: auto; }
  .stock-table { width: 100%; min-width: 760px; border-collapse: separate; border-spacing: 0; color: #e2e8f0; font-size: 14px; } .stock-table th { position: sticky; top: 0; background: #1e293b; color: #94a3b8; font-size: 12px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; text-align: left; padding: 16px 22px; border-bottom: 1px solid rgba(148,163,184,.16); } .stock-table td { padding: 18px 22px; border-bottom: 1px solid rgba(148,163,184,.1); font-weight: 650; } .stock-table tbody tr:nth-child(even) { background: rgba(15,23,42,.28); } .stock-table tbody tr:hover { background: rgba(37,99,235,.12); }
  .stock-badge { display: inline-flex; min-height: 28px; align-items: center; border-radius: 999px; padding: 0 11px; font-size: 12px; font-weight: 900; } .stock-in { color: #bbf7d0; background: rgba(34,197,94,.13); border: 1px solid rgba(34,197,94,.22); } .stock-out { color: #fecaca; background: rgba(239,68,68,.14); border: 1px solid rgba(239,68,68,.28); } .stock-empty { text-align: center; color: #94a3b8; }
  @keyframes stockFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 920px) { .stock-shell { display: block; } .stock-sidebar { position: sticky; top: 0; width: 100%; min-height: auto; padding: 14px; border-right: 0; border-bottom: 1px solid rgba(148,163,184,.14); gap: 14px; } .stock-brand { padding: 0 2px 14px; } .stock-nav { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); } .stock-main { margin-left: 0; padding: 18px; } .stock-header, .stock-toolbar { flex-direction: column; align-items: stretch; } .stock-primary-button, .stock-search, .stock-filter { width: 100%; justify-content: center; } .stock-logout { margin-top: 12px; } }
`;
