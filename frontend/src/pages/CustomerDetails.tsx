import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { canAccessNav } from "../utils/auth";

export default function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [followups, setFollowups] = useState<any[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch customer details");
    }
  };

  const fetchFollowups = async () => {
    try {
      const res = await api.get(`/customers/${id}/followups`);
      setFollowups(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch follow-up notes");
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchFollowups();
  }, [id]);

  const addNote = async () => {
    const userId = Number(localStorage.getItem("userId"));

    if (!Number.isInteger(userId) || userId <= 0) {
      alert("Logged-in user id is missing. Please login again.");
      navigate("/");
      return;
    }

    try {
      await api.post(`/customers/${id}/followups`, {
        note,
        follow_up_date: followUpDate || null,
        created_by: userId,
      });

      setNote("");
      setFollowUpDate("");
      setShowNoteModal(false);
      fetchFollowups();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add follow-up note");
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Customers", path: "/customers" },
    { label: "Products", path: "/products" },
    { label: "Orders", path: "/orders" },
    { label: "Sales Challans", path: "/sales-challans" },
    { label: "Stock History", path: "/stock-history" },
  ].filter((item) => canAccessNav(item.label));

  return (
    <>
      <style>{customerDetailsStyles}</style>
      <div className="customer-detail-shell">
        <aside className="customer-detail-sidebar">
          <div>
            <div className="customer-detail-brand">
              <span>M</span>
              <div>
                <h2>Mini ERP</h2>
                <p>CRM Admin</p>
              </div>
            </div>

            <nav className="customer-detail-nav">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`customer-detail-nav-button${
                    item.label === "Customers" ? " active" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="customer-detail-nav-icon">•</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            className="customer-detail-logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
            }}
          >
            <span className="customer-detail-nav-icon">•</span>
            <span>Logout</span>
          </button>
        </aside>

        <main className="customer-detail-main">
          <section className="customer-detail-header">
            <div>
              <p className="customer-detail-eyebrow">Customer Profile</p>
              <h1>{customer?.customer_name || "Customer Details"}</h1>
              <p className="customer-detail-subtitle">
                View contact information, business details, and follow-up
                history.
              </p>
            </div>

            <div className="customer-detail-header-actions">
              <button
                className="customer-detail-secondary-button"
                onClick={() => navigate("/customers")}
              >
                Back
              </button>
              <button
                className="customer-detail-primary-button"
                onClick={() => setShowNoteModal(true)}
              >
                Add Note
              </button>
            </div>
          </section>

          {customer && (
            <section className="customer-detail-grid">
              <InfoCard label="Mobile" value={customer.mobile} />
              <InfoCard label="Email" value={customer.email} />
              <InfoCard label="Business Name" value={customer.business_name} />
              <InfoCard label="GST Number" value={customer.gst_number} />
              <InfoCard label="Customer Type" value={customer.customer_type} />
              <InfoCard label="Status" value={customer.status} />
              <InfoCard label="Follow-up Date" value={formatDateOnly(customer.follow_up_date)} />
              <InfoCard label="Address" value={customer.address} wide />
              <InfoCard label="Notes" value={customer.notes} wide />
            </section>
          )}

          <section className="customer-detail-card">
            <div className="customer-detail-section-header">
              <div>
                <p className="customer-detail-eyebrow">Timeline</p>
                <h2>Follow-up Notes</h2>
              </div>
              <span>{followups.length} notes</span>
            </div>

            <div className="customer-detail-timeline">
              {followups.length > 0 ? (
                followups.map((followup) => (
                  <article className="customer-detail-timeline-item" key={followup.id}>
                    <div className="customer-detail-timeline-dot"></div>
                    <div>
                      <div className="customer-detail-timeline-top">
                        <strong>{followup.created_by || "System"}</strong>
                        <span>{formatDateTime(followup.created_at)}</span>
                      </div>
                      <p>{followup.note}</p>
                      {followup.follow_up_date && (
                        <small>Next follow-up: {formatDateOnly(followup.follow_up_date)}</small>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <p className="customer-detail-empty">No follow-up notes yet.</p>
              )}
            </div>
          </section>
        </main>

        {showNoteModal && (
          <div className="customer-detail-modal-backdrop">
            <div className="customer-detail-modal">
              <div className="customer-detail-modal-header">
                <div>
                  <p className="customer-detail-eyebrow">New Follow-up</p>
                  <h2>Add Note</h2>
                </div>
                <button onClick={() => setShowNoteModal(false)}>×</button>
              </div>

              <label className="customer-detail-field">
                <span>Note</span>
                <textarea
                  placeholder="Enter follow-up note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>

              <label className="customer-detail-field">
                <span>Follow-up Date</span>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </label>

              <div className="customer-detail-modal-actions">
                <button className="customer-detail-primary-button" onClick={addNote}>
                  Save Note
                </button>
                <button
                  className="customer-detail-secondary-button"
                  onClick={() => setShowNoteModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InfoCard({ label, value, wide }: { label: string; value: any; wide?: boolean }) {
  return (
    <article className={`customer-detail-info-card${wide ? " wide" : ""}`}>
      <p>{label}</p>
      <h2>{value || "-"}</h2>
    </article>
  );
}

function formatDateOnly(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN");
}

function formatDateTime(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN");
}

const customerDetailsStyles = `
  .customer-detail-shell { width: 100vw; min-height: 100vh; margin-left: calc((100% - 100vw) / 2); display: flex; color: #f8fafc; background: radial-gradient(circle at top right, rgba(37,99,235,.22), transparent 34rem), #0f172a; text-align: left; }
  .customer-detail-sidebar { position: fixed; inset: 0 auto 0 0; width: 280px; background: rgba(17,24,39,.98); border-right: 1px solid rgba(148,163,184,.14); padding: 24px 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 20px 0 45px rgba(0,0,0,.24); z-index: 10; }
  .customer-detail-brand { display: flex; align-items: center; gap: 14px; padding: 8px 8px 28px; } .customer-detail-brand > span { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: linear-gradient(135deg,#2563eb,#8b5cf6); color: #fff; font-weight: 900; }
  .customer-detail-brand h2, .customer-detail-brand p, .customer-detail-header h1, .customer-detail-header p { margin: 0; } .customer-detail-brand h2 { color: #fff; font-size: 20px; } .customer-detail-brand p { color: #94a3b8; font-size: 13px; }
  .customer-detail-nav { display: flex; flex-direction: column; gap: 10px; } .customer-detail-nav-button, .customer-detail-logout { width: 100%; min-height: 48px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: #cbd5e1; display: flex; align-items: center; gap: 12px; padding: 0 14px; cursor: pointer; font: inherit; font-weight: 700; transition: .18s ease; }
  .customer-detail-nav-button:hover, .customer-detail-logout:hover { transform: translateX(4px); background: rgba(30,41,59,.95); color: #fff; } .customer-detail-nav-button.active { background: linear-gradient(135deg,rgba(37,99,235,.95),rgba(139,92,246,.9)); color: #fff; }
  .customer-detail-logout { color: #fecaca; background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.16); } .customer-detail-nav-icon { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,.1); }
  .customer-detail-main { width: 100%; min-width: 0; margin-left: 280px; padding: 34px; animation: detailFade .42s ease both; }
  .customer-detail-header { border: 1px solid rgba(148,163,184,.12); border-radius: 24px; padding: 30px; background: linear-gradient(135deg,rgba(30,41,59,.96),rgba(15,23,42,.78)); box-shadow: 0 24px 70px rgba(0,0,0,.24); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .customer-detail-eyebrow { margin: 0 0 10px; color: #93c5fd; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; } .customer-detail-header h1 { color: #fff; font-size: clamp(34px,5vw,54px); line-height: 1.02; letter-spacing: 0; } .customer-detail-subtitle { margin-top: 12px; color: #cbd5e1; line-height: 1.6; }
  .customer-detail-header-actions, .customer-detail-modal-actions { display: flex; gap: 12px; flex-wrap: wrap; } .customer-detail-primary-button, .customer-detail-secondary-button { min-height: 44px; border: 0; border-radius: 13px; padding: 0 18px; color: #fff; cursor: pointer; font-weight: 850; transition: .18s ease; } .customer-detail-primary-button { background: #2563eb; box-shadow: 0 16px 32px rgba(37,99,235,.28); } .customer-detail-secondary-button { background: #334155; }
  .customer-detail-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; margin-top: 22px; } .customer-detail-info-card, .customer-detail-card { border: 1px solid rgba(148,163,184,.12); border-radius: 20px; background: rgba(30,41,59,.92); box-shadow: 0 24px 70px rgba(0,0,0,.18); padding: 20px; } .customer-detail-info-card.wide { grid-column: span 3; } .customer-detail-info-card p { margin: 0 0 8px; color: #94a3b8; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; } .customer-detail-info-card h2 { margin: 0; color: #fff; font-size: 18px; overflow-wrap: anywhere; }
  .customer-detail-card { margin-top: 22px; } .customer-detail-section-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid rgba(148,163,184,.12); padding-bottom: 16px; } .customer-detail-section-header h2 { margin: 0; color: #fff; }
  .customer-detail-timeline { display: grid; gap: 16px; margin-top: 18px; } .customer-detail-timeline-item { display: grid; grid-template-columns: 16px 1fr; gap: 14px; } .customer-detail-timeline-dot { width: 12px; height: 12px; margin-top: 5px; border-radius: 999px; background: #22c55e; box-shadow: 0 0 0 6px rgba(34,197,94,.12); } .customer-detail-timeline-top { display: flex; justify-content: space-between; gap: 12px; color: #fff; } .customer-detail-timeline-item p { margin: 8px 0 0; color: #cbd5e1; line-height: 1.6; } .customer-detail-timeline-item small { display: inline-block; margin-top: 8px; color: #93c5fd; font-weight: 800; }
  .customer-detail-empty { color: #94a3b8; text-align: center; }
  .customer-detail-modal-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 22px; background: rgba(2,6,23,.72); backdrop-filter: blur(8px); } .customer-detail-modal { width: min(100%,560px); border: 1px solid rgba(148,163,184,.18); border-radius: 22px; padding: 24px; background: #1e293b; box-shadow: 0 30px 90px rgba(0,0,0,.48); } .customer-detail-modal-header { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 18px; } .customer-detail-modal-header h2 { margin: 0; color: #fff; } .customer-detail-modal-header button { width: 40px; height: 40px; border: 0; border-radius: 12px; color: #fff; background: rgba(15,23,42,.72); cursor: pointer; font-size: 24px; }
  .customer-detail-field { display: grid; gap: 8px; margin-top: 14px; } .customer-detail-field span { color: #cbd5e1; font-size: 13px; font-weight: 800; } .customer-detail-field input, .customer-detail-field textarea { width: 100%; border: 1px solid rgba(148,163,184,.18); border-radius: 14px; outline: 0; padding: 12px 14px; background: rgba(15,23,42,.74); color: #fff; font: inherit; } .customer-detail-field textarea { min-height: 120px; resize: vertical; } .customer-detail-modal-actions { margin-top: 20px; justify-content: flex-end; }
  @keyframes detailFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 920px) { .customer-detail-shell { display: block; } .customer-detail-sidebar { position: sticky; top: 0; width: 100%; min-height: auto; padding: 14px; border-right: 0; border-bottom: 1px solid rgba(148,163,184,.14); gap: 14px; } .customer-detail-brand { padding: 0 2px 14px; } .customer-detail-nav { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); } .customer-detail-main { margin-left: 0; padding: 18px; } .customer-detail-header, .customer-detail-header-actions, .customer-detail-modal-actions { flex-direction: column; align-items: stretch; } .customer-detail-grid { grid-template-columns: 1fr; } .customer-detail-info-card.wide { grid-column: auto; } .customer-detail-logout { margin-top: 12px; } }
`;
