import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { canAccessNav } from "../utils/auth";

export default function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [address, setAddress] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const deleteCustomer = async (id: number) => {
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const addCustomer = async () => {
    try {
      await api.post("/customers", {
        customer_name: customerName,
        mobile,
        email,
        business_name: businessName,
        gst_number: gstNumber,
        customer_type: customerType,
        address,
        status: "Lead",
        follow_up_date: null,
      });

      fetchCustomers();

      setCustomerName("");
      setMobile("");
      setEmail("");
      setBusinessName("");

      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add customer");
    }
  };

  const updateCustomer = async () => {
    try {
      await api.put(`/customers/${editingId}`, {
        customer_name: customerName,
        mobile,
        email,
        business_name: businessName,
      });

      fetchCustomers();

      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);

      setCustomerName("");
      setMobile("");
      setEmail("");
      setBusinessName("");
    } catch (err) {
      console.error(err);
      alert("Failed to update customer");
    }
  };

  const editCustomer = (customer: any) => {
    setIsEditing(true);
    setEditingId(customer.id);
    setCustomerName(customer.customer_name);
    setMobile(customer.mobile);
    setEmail(customer.email);
    setBusinessName(customer.business_name);
    setShowForm(true);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Customers", path: "/customers", icon: <CustomersIcon /> },
    { label: "Products", path: "/products", icon: <ProductsIcon /> },
    { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
    { label: "Sales Challans", path: "/sales-challans", icon: <OrdersIcon /> },
  ].filter((item) => canAccessNav(item.label));

  return (
    <>
      <style>{customersStyles}</style>

      <div className="customers-shell">
        <aside className="customers-sidebar">
          <div>
            <div className="customers-brand">
              <span className="customers-brand-mark">M</span>
              <div>
                <h2>Mini ERP</h2>
                <p>CRM Admin</p>
              </div>
            </div>

            <nav className="customers-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`customers-nav-button${
                    item.path === "/customers" ? " active" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="customers-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            className="customers-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <span className="customers-nav-icon">
              <LogoutIcon />
            </span>
            <span>Logout</span>
          </button>
        </aside>

        <main className="customers-main">
          <section className="customers-header">
            <div>
              <p className="customers-eyebrow">CRM Workspace</p>
              <h1>Customers</h1>
              <p className="customers-subtitle">Manage customer records</p>
            </div>

            <button
              className="customers-add-button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);

                setCustomerName("");
                setMobile("");
                setEmail("");
                setBusinessName("");

                setShowForm(true);
              }}
            >
              <PlusIcon />
              Add Customer
            </button>
          </section>

          <section className="customers-toolbar">
            <label className="customers-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <span className="customers-count">
              {filteredCustomers.length} records
            </span>
          </section>

          <section className="customers-card">
            <div className="customers-table-wrap">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Business</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                          <div className="customers-name-cell">
                            <span className="customers-avatar">
                              {customer.customer_name?.charAt(0)?.toUpperCase() ||
                                "C"}
                            </span>
                            <span>{customer.customer_name}</span>
                          </div>
                        </td>
                        <td>{customer.mobile}</td>
                        <td>{customer.email}</td>
                        <td>
                          <span className="customers-status-badge">
                            {customer.business_name || "Individual"}
                          </span>
                        </td>
                        <td>
                          <div className="customers-actions">
                            <button
                              className="customers-icon-button customers-view-button"
                              onClick={() => navigate(`/customers/${customer.id}`)}
                            >
                              View Details
                            </button>

                            <button
                              className="customers-icon-button customers-edit-button"
                              onClick={() => editCustomer(customer)}
                            >
                              <PencilIcon />
                              Edit
                            </button>

                            <button
                              className="customers-icon-button customers-delete-button"
                              onClick={() => deleteCustomer(customer.id)}
                            >
                              <TrashIcon />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="customers-empty-row" colSpan={6}>
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {showForm && (
          <div className="customers-modal-backdrop">
            <div className="customers-modal">
              <div className="customers-modal-header">
                <div>
                  <p className="customers-eyebrow">
                    {isEditing ? "Update record" : "New record"}
                  </p>
                  <h2>{isEditing ? "Edit Customer" : "Add Customer"}</h2>
                </div>

                <button
                  className="customers-close-button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close customer form"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="customers-form-grid">
                <label className="customers-field">
                  <span>Customer Name</span>
                  <input
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </label>

                <label className="customers-field">
                  <span>Mobile</span>
                  <input
                    placeholder="Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </label>

                <label className="customers-field">
                  <span>Email</span>
                  <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <label className="customers-field">
                  <span>Business Name</span>
                  <input
                    placeholder="Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </label>

                <label className="customers-field">
                  <span>GST Number</span>
                  <input
                    placeholder="GST Number"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                  />
                </label>

                <label className="customers-field">
                  <span>Customer Type</span>
                  <input
                    placeholder="Customer Type"
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                  />
                </label>

                <label className="customers-field customers-field-wide">
                  <span>Address</span>
                  <input
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </label>
              </div>

              <div className="customers-modal-actions">
                <button
                  className="customers-save-button"
                  onClick={isEditing ? updateCustomer : addCustomer}
                >
                  {isEditing ? "Update" : "Save"}
                </button>

                <button
                  className="customers-cancel-button"
                  onClick={() => setShowForm(false)}
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

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17.3V21h3.7L18.6 10.1l-3.7-3.7L4 17.3Zm17.4-10c.4-.4.4-1 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7 1.8-1.8Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 4l1-1h6l1 1h4v2H4V4h4Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" />
    </svg>
  );
}

const customersStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    background: #0f172a;
  }

  .customers-shell {
    width: 100vw;
    min-height: 100vh;
    margin-left: calc((100% - 100vw) / 2);
    background:
      radial-gradient(circle at top right, rgba(37, 99, 235, 0.22), transparent 34rem),
      radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.12), transparent 28rem),
      #0f172a;
    color: #f8fafc;
    display: flex;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    text-align: left;
  }

  .customers-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 280px;
    background: rgba(17, 24, 39, 0.98);
    border-right: 1px solid rgba(148, 163, 184, 0.12);
    padding: 24px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 20px 0 45px rgba(0, 0, 0, 0.24);
    z-index: 10;
  }

  .customers-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 8px 28px;
  }

  .customers-brand-mark {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #2563eb, #8b5cf6);
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;
    box-shadow: 0 16px 32px rgba(37, 99, 235, 0.26);
  }

  .customers-brand h2,
  .customers-brand p,
  .customers-header h1,
  .customers-header p,
  .customers-modal h2,
  .customers-eyebrow {
    margin: 0;
  }

  .customers-brand h2 {
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0;
  }

  .customers-brand p {
    color: #94a3b8;
    font-size: 13px;
    margin-top: 2px;
  }

  .customers-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .customers-nav-button,
  .customers-logout {
    width: 100%;
    min-height: 48px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: transparent;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 14px;
    cursor: pointer;
    font: inherit;
    font-size: 15px;
    font-weight: 700;
    transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, color 180ms ease;
  }

  .customers-nav-button:hover,
  .customers-logout:hover {
    transform: translateX(4px);
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(148, 163, 184, 0.18);
    color: #ffffff;
  }

  .customers-nav-button.active {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(139, 92, 246, 0.9));
    border-color: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    box-shadow: 0 18px 30px rgba(37, 99, 235, 0.25);
  }

  .customers-logout {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.16);
  }

  .customers-nav-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 0.1);
  }

  .customers-nav-icon svg,
  .customers-add-button svg,
  .customers-search svg,
  .customers-icon-button svg,
  .customers-close-button svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .customers-main {
    width: 100%;
    min-width: 0;
    margin-left: 280px;
    padding: 34px;
    animation: customersFadeIn 420ms ease both;
  }

  .customers-header {
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 24px;
    padding: 30px;
    background:
      linear-gradient(135deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.78)),
      linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(139, 92, 246, 0.16));
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .customers-eyebrow {
    margin-bottom: 10px;
    color: #93c5fd;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .customers-header h1 {
    color: #ffffff;
    font-size: clamp(34px, 5vw, 54px);
    line-height: 1.02;
    font-weight: 850;
    letter-spacing: 0;
  }

  .customers-subtitle {
    margin-top: 12px;
    color: #cbd5e1;
    font-size: 16px;
    line-height: 1.6;
  }

  .customers-add-button,
  .customers-save-button,
  .customers-cancel-button,
  .customers-icon-button,
  .customers-close-button {
    border: 0;
    cursor: pointer;
    font: inherit;
    font-weight: 800;
    transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }

  .customers-add-button {
    min-height: 48px;
    border-radius: 14px;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #ffffff;
    background: #2563eb;
    box-shadow: 0 16px 32px rgba(37, 99, 235, 0.32);
  }

  .customers-add-button:hover,
  .customers-save-button:hover,
  .customers-icon-button:hover {
    transform: translateY(-2px);
  }

  .customers-add-button:hover,
  .customers-save-button:hover {
    background: #1d4ed8;
    box-shadow: 0 20px 38px rgba(37, 99, 235, 0.4);
  }

  .customers-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 22px;
  }

  .customers-search {
    width: min(100%, 460px);
    min-height: 50px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 16px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #94a3b8;
    background: rgba(30, 41, 59, 0.92);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }

  .customers-search:focus-within {
    border-color: rgba(37, 99, 235, 0.75);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .customers-search input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #ffffff;
    font: inherit;
    font-size: 15px;
  }

  .customers-search input::placeholder {
    color: #64748b;
  }

  .customers-count {
    min-height: 36px;
    border: 1px solid rgba(34, 197, 94, 0.22);
    border-radius: 999px;
    padding: 8px 13px;
    color: #bbf7d0;
    background: rgba(34, 197, 94, 0.1);
    font-size: 13px;
    font-weight: 800;
    white-space: nowrap;
  }

  .customers-card {
    margin-top: 22px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 22px;
    background: rgba(30, 41, 59, 0.92);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
    overflow: hidden;
  }

  .customers-table-wrap {
    width: 100%;
    max-height: calc(100vh - 310px);
    overflow: auto;
  }

  .customers-table {
    width: 100%;
    min-width: 880px;
    border-collapse: separate;
    border-spacing: 0;
    color: #e2e8f0;
    font-size: 14px;
  }

  .customers-table th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #1e293b;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: left;
    padding: 16px 22px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  }

  .customers-table td {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    font-weight: 650;
    vertical-align: middle;
  }

  .customers-table tbody tr {
    transition: background 160ms ease;
  }

  .customers-table tbody tr:nth-child(even) {
    background: rgba(15, 23, 42, 0.28);
  }

  .customers-table tbody tr:hover {
    background: rgba(37, 99, 235, 0.12);
  }

  .customers-name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #ffffff;
  }

  .customers-avatar {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: inline-grid;
    place-items: center;
    color: #ffffff;
    background: linear-gradient(135deg, #2563eb, #8b5cf6);
    font-size: 13px;
    font-weight: 900;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
  }

  .customers-status-badge {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    border-radius: 999px;
    padding: 0 11px;
    color: #bfdbfe;
    background: rgba(37, 99, 235, 0.13);
    border: 1px solid rgba(37, 99, 235, 0.22);
    font-size: 12px;
    font-weight: 900;
    white-space: nowrap;
  }

  .customers-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .customers-icon-button {
    min-height: 36px;
    border-radius: 11px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #ffffff;
    font-size: 13px;
  }

  .customers-edit-button {
    background: #2563eb;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.24);
  }

  .customers-view-button {
    background: #8b5cf6;
    box-shadow: 0 12px 24px rgba(139, 92, 246, 0.22);
  }

  .customers-view-button:hover {
    background: #7c3aed;
  }

  .customers-edit-button:hover {
    background: #1d4ed8;
  }

  .customers-delete-button {
    background: #ef4444;
    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.2);
  }

  .customers-delete-button:hover {
    background: #dc2626;
    box-shadow: 0 16px 30px rgba(239, 68, 68, 0.28);
  }

  .customers-empty-row {
    color: #94a3b8;
    text-align: center;
  }

  .customers-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 22px;
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(8px);
    animation: customersFadeIn 180ms ease both;
  }

  .customers-modal {
    width: min(100%, 560px);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 22px;
    padding: 24px;
    background: #1e293b;
    color: #ffffff;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.48);
  }

  .customers-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 22px;
  }

  .customers-modal h2 {
    color: #ffffff;
    font-size: 26px;
    font-weight: 850;
    letter-spacing: 0;
  }

  .customers-close-button {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .customers-close-button:hover {
    transform: rotate(4deg) scale(1.04);
    color: #ffffff;
    border-color: rgba(239, 68, 68, 0.42);
  }

  .customers-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .customers-field {
    display: grid;
    gap: 8px;
  }

  .customers-field-wide {
    grid-column: 1 / -1;
  }

  .customers-field span {
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 800;
  }

  .customers-field input {
    width: 100%;
    min-height: 48px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 14px;
    outline: 0;
    padding: 0 14px;
    background: rgba(15, 23, 42, 0.74);
    color: #ffffff;
    font: inherit;
    transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
  }

  .customers-field input:focus {
    border-color: rgba(37, 99, 235, 0.8);
    background: rgba(15, 23, 42, 0.94);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .customers-field input::placeholder {
    color: #64748b;
  }

  .customers-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .customers-save-button,
  .customers-cancel-button {
    min-height: 44px;
    border-radius: 13px;
    padding: 0 18px;
  }

  .customers-save-button {
    color: #ffffff;
    background: #2563eb;
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.28);
  }

  .customers-cancel-button {
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .customers-cancel-button:hover {
    transform: translateY(-2px);
    color: #ffffff;
    border-color: rgba(148, 163, 184, 0.32);
  }

  @keyframes customersFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 920px) {
    .customers-shell {
      display: block;
    }

    .customers-sidebar {
      position: sticky;
      top: 0;
      width: 100%;
      min-height: auto;
      padding: 14px;
      border-right: 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      gap: 14px;
    }

    .customers-brand {
      padding: 0 2px 14px;
    }

    .customers-nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .customers-logout {
      margin-top: 12px;
    }

    .customers-main {
      margin-left: 0;
      padding: 18px;
    }

    .customers-header,
    .customers-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .customers-add-button,
    .customers-search,
    .customers-count {
      width: 100%;
      justify-content: center;
    }

    .customers-table-wrap {
      max-height: none;
    }
  }

  @media (max-width: 580px) {
    .customers-nav-button,
    .customers-logout {
      padding: 0 10px;
      font-size: 13px;
    }

    .customers-nav-icon {
      width: 30px;
      height: 30px;
    }

    .customers-header,
    .customers-modal {
      padding: 18px;
    }

    .customers-form-grid {
      grid-template-columns: 1fr;
    }

    .customers-modal-actions {
      flex-direction: column;
    }

    .customers-save-button,
    .customers-cancel-button {
      width: 100%;
    }
  }
`;
