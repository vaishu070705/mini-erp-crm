import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { canAccessNav } from "../utils/auth";

export default function Challans() {
  const navigate = useNavigate();
  const [challans, setChallans] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchChallans = async () => {
    try {
      const res = await api.get("/challans");
      setChallans(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch challans");
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  const confirmChallan = async (id: number) => {
    if (!window.confirm("Confirm this challan and deduct stock?")) return;

    try {
      await api.put(`/challans/${id}/confirm`);
      fetchChallans();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to confirm challan");
    }
  };

  const cancelChallan = async (id: number) => {
    if (!window.confirm("Cancel this challan?")) return;

    try {
      await api.put(`/challans/${id}/cancel`);
      fetchChallans();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel challan");
    }
  };

  const deleteChallan = async (id: number) => {
    if (!window.confirm("Delete this draft challan?")) return;

    try {
      await api.delete(`/challans/${id}`);
      fetchChallans();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete challan");
    }
  };

  const filteredChallans = challans.filter((challan) => {
    const matchesSearch =
      challan.challan_number?.toLowerCase().includes(search.toLowerCase()) ||
      challan.customer_name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || challan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style>{challansStyles}</style>

      <div className="challans-shell">
        <Sidebar active="Sales Challans" />

        <main className="challans-main">
          <section className="challans-header">
            <div>
              <p className="challans-eyebrow">Sales Dispatch</p>
              <h1>Sales Challans</h1>
              <p className="challans-subtitle">
                Create, confirm, cancel, and track customer delivery challans.
              </p>
            </div>

            <button
              className="challans-primary-button"
              onClick={() => navigate("/challans/new")}
            >
              <PlusIcon />
              Create Challan
            </button>
          </section>

          <section className="challans-toolbar">
            <label className="challans-search">
              <SearchIcon />
              <input
                placeholder="Search challan or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <select
              className="challans-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Draft</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
          </section>

          <section className="challans-card">
            <div className="challans-table-wrap">
              <table className="challans-table">
                <thead>
                  <tr>
                    <th>Challan No.</th>
                    <th>Customer</th>
                    <th>Total Qty</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredChallans.length > 0 ? (
                    filteredChallans.map((challan) => (
                      <tr key={challan.id}>
                        <td>{challan.challan_number}</td>
                        <td>{challan.customer_name || "-"}</td>
                        <td>{challan.total_quantity}</td>
                        <td>
                          <span
                            className={`challans-status ${getStatusClass(
                              challan.status
                            )}`}
                          >
                            {challan.status}
                          </span>
                        </td>
                        <td>{challan.created_by || "System"}</td>
                        <td>{formatDate(challan.created_at)}</td>
                        <td>
                          <div className="challans-actions">
                            <button
                              className="challans-action-button"
                              onClick={() => navigate(`/challans/${challan.id}`)}
                            >
                              View
                            </button>

                            {challan.status === "Draft" && (
                              <>
                                <button
                                  className="challans-action-button challans-edit"
                                  onClick={() =>
                                    navigate(`/challans/${challan.id}/edit`)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="challans-action-button challans-success"
                                  onClick={() => confirmChallan(challan.id)}
                                >
                                  Confirm
                                </button>

                                <button
                                  className="challans-action-button challans-danger"
                                  onClick={() => deleteChallan(challan.id)}
                                >
                                  Delete Draft
                                </button>
                              </>
                            )}

                            {challan.status === "Confirmed" && (
                              <button
                                className="challans-action-button challans-warning"
                                onClick={() => cancelChallan(challan.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="challans-empty" colSpan={7}>
                        No challans found.
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

export function Sidebar({ active }: { active: string }) {
  const navigate = useNavigate();
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Customers", path: "/customers", icon: <CustomersIcon /> },
    { label: "Products", path: "/products", icon: <ProductsIcon /> },
    { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
    { label: "Sales Challans", path: "/sales-challans", icon: <ChallansIcon /> },
  ].filter((item) => canAccessNav(item.label));

  return (
    <aside className="challans-sidebar">
      <div>
        <div className="challans-brand">
          <span className="challans-brand-mark">M</span>
          <div>
            <h2>Mini ERP</h2>
            <p>CRM Admin</p>
          </div>
        </div>

        <nav className="challans-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`challans-nav-button${
                item.label === active ? " active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="challans-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <button
        className="challans-logout"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        <span className="challans-nav-icon">
          <LogoutIcon />
        </span>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export function formatDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN");
}

export function getStatusClass(status: string) {
  if (status === "Confirmed") return "challans-status-confirmed";
  if (status === "Cancelled") return "challans-status-cancelled";
  return "challans-status-draft";
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6.5 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM9 13c-3.4 0-6 1.7-6 4v2h12v-2c0-2.3-2.6-4-6-4Zm6.5.5c-.7 0-1.4.1-2 .3 1.7.8 2.8 1.9 2.8 3.2v2H21v-1.8c0-2.1-2.4-3.7-5.5-3.7Z" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 8 4.2v11.6L12 22l-8-4.2V6.2L12 2Zm0 2.3L7.1 6.9 12 9.5l4.9-2.6L12 4.3Zm-6 4v8.3l5 2.6v-8.3L6 8.3Zm7 10.9 5-2.6V8.3l-5 2.6v8.3Z" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM6.2 6l.8 4h8.9l2.2-4H6.2Zm-.4-2H21l-4 8H7.4l.4 2H19v2H6.2L3.8 4H2V2h3.4l.4 2Z" />
    </svg>
  );
}

function ChallansIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2ZM4 6H2v16h2V6Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3h8v2H7v14h6v2H5V3Zm11.6 5.4L20.2 12l-3.6 3.6-1.4-1.4 1.2-1.2H11v-2h5.4l-1.2-1.2 1.4-1.4Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-8 6a8 8 0 1 1 14.3 4.9l4.4 4.4-1.4 1.4-4.4-4.4A8 8 0 0 1 2 10Z" />
    </svg>
  );
}

export const challansStyles = `
  .challans-shell { width: 100vw; min-height: 100vh; margin-left: calc((100% - 100vw) / 2); display: flex; color: #f8fafc; background: radial-gradient(circle at top right, rgba(37,99,235,.22), transparent 34rem), #0f172a; text-align: left; }
  .challans-sidebar { position: fixed; inset: 0 auto 0 0; width: 280px; background: rgba(17,24,39,.98); border-right: 1px solid rgba(148,163,184,.14); padding: 24px 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 20px 0 45px rgba(0,0,0,.24); z-index: 10; }
  .challans-brand { display: flex; align-items: center; gap: 14px; padding: 8px 8px 28px; }
  .challans-brand-mark { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: linear-gradient(135deg,#2563eb,#8b5cf6); color: #fff; font-size: 20px; font-weight: 800; }
  .challans-brand h2, .challans-brand p, .challans-header h1, .challans-header p { margin: 0; }
  .challans-brand h2 { color: #fff; font-size: 20px; font-weight: 800; } .challans-brand p { color: #94a3b8; font-size: 13px; }
  .challans-nav { display: flex; flex-direction: column; gap: 10px; }
  .challans-nav-button, .challans-logout { width: 100%; min-height: 48px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: #cbd5e1; display: flex; align-items: center; gap: 12px; padding: 0 14px; cursor: pointer; font: inherit; font-size: 15px; font-weight: 700; transition: .18s ease; }
  .challans-nav-button:hover, .challans-logout:hover { transform: translateX(4px); background: rgba(30,41,59,.95); color: #fff; }
  .challans-nav-button.active { background: linear-gradient(135deg,rgba(37,99,235,.95),rgba(139,92,246,.9)); color: #fff; box-shadow: 0 18px 30px rgba(37,99,235,.25); }
  .challans-logout { color: #fecaca; background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.16); }
  .challans-nav-icon { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,.1); } .challans-nav-icon svg, .challans-primary-button svg, .challans-search svg { width: 18px; height: 18px; fill: currentColor; }
  .challans-main { width: 100%; min-width: 0; margin-left: 280px; padding: 34px; animation: challansFade .42s ease both; }
  .challans-header { border: 1px solid rgba(148,163,184,.12); border-radius: 24px; padding: 30px; background: linear-gradient(135deg,rgba(30,41,59,.96),rgba(15,23,42,.78)); box-shadow: 0 24px 70px rgba(0,0,0,.24); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .challans-eyebrow { margin-bottom: 10px; color: #93c5fd; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .challans-header h1 { color: #fff; font-size: clamp(34px,5vw,54px); line-height: 1.02; font-weight: 850; letter-spacing: 0; }
  .challans-subtitle { margin-top: 12px; color: #cbd5e1; font-size: 16px; line-height: 1.6; }
  .challans-primary-button { min-height: 48px; border: 0; border-radius: 14px; padding: 0 20px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; color: #fff; background: #2563eb; cursor: pointer; font-weight: 800; box-shadow: 0 16px 32px rgba(37,99,235,.32); transition: .18s ease; }
  .challans-primary-button:hover, .challans-action-button:hover { transform: translateY(-2px); }
  .challans-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-top: 22px; }
  .challans-search, .challans-filter { min-height: 50px; border: 1px solid rgba(148,163,184,.18); border-radius: 16px; background: rgba(30,41,59,.92); color: #fff; box-shadow: 0 18px 42px rgba(0,0,0,.18); }
  .challans-search { width: min(100%, 460px); padding: 0 16px; display: flex; align-items: center; gap: 12px; color: #94a3b8; } .challans-search input { width: 100%; border: 0; outline: 0; background: transparent; color: #fff; }
  .challans-filter { padding: 0 14px; outline: 0; } .challans-filter option { background: #1e293b; }
  .challans-card { margin-top: 22px; border: 1px solid rgba(148,163,184,.12); border-radius: 22px; background: rgba(30,41,59,.92); box-shadow: 0 24px 70px rgba(0,0,0,.24); overflow: hidden; }
  .challans-table-wrap { width: 100%; overflow: auto; } .challans-table { width: 100%; min-width: 980px; border-collapse: separate; border-spacing: 0; color: #e2e8f0; font-size: 14px; }
  .challans-table th { position: sticky; top: 0; background: #1e293b; color: #94a3b8; font-size: 12px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; text-align: left; padding: 16px 22px; border-bottom: 1px solid rgba(148,163,184,.16); }
  .challans-table td { padding: 18px 22px; border-bottom: 1px solid rgba(148,163,184,.1); font-weight: 650; } .challans-table tbody tr:nth-child(even) { background: rgba(15,23,42,.28); } .challans-table tbody tr:hover { background: rgba(37,99,235,.12); }
  .challans-status { display: inline-flex; min-height: 28px; align-items: center; border-radius: 999px; padding: 0 11px; font-size: 12px; font-weight: 900; }
  .challans-status-draft { color: #bfdbfe; background: rgba(37,99,235,.13); border: 1px solid rgba(37,99,235,.22); } .challans-status-confirmed { color: #bbf7d0; background: rgba(34,197,94,.13); border: 1px solid rgba(34,197,94,.22); } .challans-status-cancelled { color: #fecaca; background: rgba(239,68,68,.14); border: 1px solid rgba(239,68,68,.28); }
  .challans-actions { display: flex; gap: 8px; flex-wrap: wrap; } .challans-action-button { min-height: 34px; border: 0; border-radius: 10px; padding: 0 11px; color: #fff; background: #334155; cursor: pointer; font-weight: 800; transition: .18s ease; }
  .challans-edit { background: #2563eb; } .challans-success { background: #22c55e; } .challans-warning { background: #f59e0b; } .challans-danger { background: #ef4444; } .challans-empty { text-align: center; color: #94a3b8; }
  @keyframes challansFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 920px) { .challans-shell { display: block; } .challans-sidebar { position: sticky; top: 0; width: 100%; min-height: auto; padding: 14px; border-right: 0; border-bottom: 1px solid rgba(148,163,184,.14); gap: 14px; } .challans-brand { padding: 0 2px 14px; } .challans-nav { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); } .challans-main { margin-left: 0; padding: 18px; } .challans-header, .challans-toolbar { flex-direction: column; align-items: stretch; } .challans-primary-button, .challans-search, .challans-filter { width: 100%; justify-content: center; } .challans-logout { margin-top: 12px; } }
`;
