import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { canAccessNav } from "../utils/auth";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [status, setStatus] = useState("Pending");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const clearForm = () => {
    setCustomerId("");
    setProductId("");
    setQuantity("");
    setTotalPrice("");
    setStatus("Pending");
    setEditingId(null);
  };

  const saveOrder = async () => {
    const data = {
      customer_id: Number(customerId),
      product_id: Number(productId),
      quantity: Number(quantity),
      total_price: Number(totalPrice),
      order_status: status,
    };

    try {
      if (editingId) {
        await api.put(`/orders/${editingId}`, data);
      } else {
        await api.post("/orders", data);
      }

      fetchOrders();
      clearForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save order");
    }
  };

  const editOrder = (order: any) => {
    setEditingId(order.id);
    setCustomerId(order.customer_id.toString());
    setProductId(order.product_id.toString());
    setQuantity(order.quantity.toString());
    setTotalPrice(order.total_price.toString());
    setStatus(order.order_status);
    setShowForm(true);
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Delete this order?")) return;

    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.order_status === "Pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.order_status === "Delivered"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total_price || 0),
    0
  );

  const formattedRevenue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const summaryCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <OrdersIcon />,
      className: "orders-summary-card orders-summary-blue",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: <ClockIcon />,
      className: "orders-summary-card orders-summary-orange",
    },
    {
      label: "Delivered Orders",
      value: deliveredOrders,
      icon: <CheckIcon />,
      className: "orders-summary-card orders-summary-green",
    },
    {
      label: "Total Revenue",
      value: formattedRevenue,
      icon: <RevenueIcon />,
      className: "orders-summary-card orders-summary-purple",
    },
  ];

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Customers", path: "/customers", icon: <CustomersIcon /> },
    { label: "Products", path: "/products", icon: <ProductsIcon /> },
    { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
    { label: "Sales Challans", path: "/sales-challans", icon: <OrdersIcon /> },
  ].filter((item) => canAccessNav(item.label));

  return (
    <>
      <style>{ordersStyles}</style>

      <div className="orders-shell">
        <aside className="orders-sidebar">
          <div>
            <div className="orders-brand">
              <span className="orders-brand-mark">M</span>
              <div>
                <h2>Mini ERP</h2>
                <p>CRM Admin</p>
              </div>
            </div>

            <nav className="orders-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`orders-nav-button${
                    item.path === "/orders" ? " active" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="orders-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            className="orders-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <span className="orders-nav-icon">
              <LogoutIcon />
            </span>
            <span>Logout</span>
          </button>
        </aside>

        <main className="orders-main">
          <section className="orders-header">
            <div>
              <p className="orders-eyebrow">Sales Workspace</p>
              <h1>Orders</h1>
              <p className="orders-subtitle">Manage customer orders</p>
            </div>

            <button
              className="orders-add-button"
              onClick={() => {
                clearForm();
                setShowForm(true);
              }}
            >
              <PlusIcon />
              Add Order
            </button>
          </section>

          <section className="orders-summary-grid" aria-label="Order summary">
            {summaryCards.map((card) => (
              <article className={card.className} key={card.label}>
                <div className="orders-summary-icon">{card.icon}</div>
                <div>
                  <p>{card.label}</p>
                  <h2>{card.value}</h2>
                </div>
              </article>
            ))}
          </section>

          <section className="orders-toolbar">
            <label className="orders-search">
              <SearchIcon />
              <input
                placeholder="Search order..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <span className="orders-count">
              {filteredOrders.length} visible orders
            </span>
          </section>

          <section className="orders-card">
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.product_name}</td>
                        <td>{order.quantity}</td>
                        <td>
                          <span className="orders-price">
                            ₹{order.total_price}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`orders-status-badge ${getStatusClass(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>
                        </td>

                        <td>
                          <div className="orders-actions">
                            <button
                              className="orders-icon-button orders-edit-button"
                              onClick={() => editOrder(order)}
                            >
                              <PencilIcon />
                              Edit
                            </button>

                            <button
                              className="orders-icon-button orders-delete-button"
                              onClick={() => deleteOrder(order.id)}
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
                      <td className="orders-empty-row" colSpan={7}>
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {showForm && (
          <div className="orders-modal-backdrop">
            <div className="orders-modal">
              <div className="orders-modal-header">
                <div>
                  <p className="orders-eyebrow">
                    {editingId ? "Update order" : "New order"}
                  </p>
                  <h2>{editingId ? "Edit Order" : "Add Order"}</h2>
                </div>

                <button
                  className="orders-close-button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close order form"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="orders-form-grid">
                <label className="orders-field">
                  <span>Customer</span>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    <option value="">Select Customer</option>

                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.customer_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="orders-field">
                  <span>Product</span>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  >
                    <option value="">Select Product</option>

                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="orders-field">
                  <span>Quantity</span>
                  <input
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </label>

                <label className="orders-field">
                  <span>Total Price</span>
                  <input
                    placeholder="Total Price"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                  />
                </label>

                <label className="orders-field orders-field-wide">
                  <span>Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </label>
              </div>

              <div className="orders-modal-actions">
                <button className="orders-save-button" onClick={saveOrder}>
                  Save
                </button>

                <button
                  className="orders-cancel-button"
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

function getStatusClass(status: string) {
  if (status === "Delivered") return "orders-status-delivered";
  if (status === "Cancelled") return "orders-status-cancelled";
  return "orders-status-pending";
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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v4.6l3.2 3.2-1.4 1.4L11 12.4V7h2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 16.2-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2h8v2H8V9Zm0 4h5v2H8v-2Z" />
    </svg>
  );
}

const ordersStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    background: #0f172a;
  }

  .orders-shell {
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

  .orders-sidebar {
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

  .orders-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 8px 28px;
  }

  .orders-brand-mark {
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

  .orders-brand h2,
  .orders-brand p,
  .orders-header h1,
  .orders-header p,
  .orders-modal h2,
  .orders-eyebrow,
  .orders-summary-card p,
  .orders-summary-card h2 {
    margin: 0;
  }

  .orders-brand h2 {
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0;
  }

  .orders-brand p {
    color: #94a3b8;
    font-size: 13px;
    margin-top: 2px;
  }

  .orders-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .orders-nav-button,
  .orders-logout {
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

  .orders-nav-button:hover,
  .orders-logout:hover {
    transform: translateX(4px);
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(148, 163, 184, 0.18);
    color: #ffffff;
  }

  .orders-nav-button.active {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(139, 92, 246, 0.9));
    border-color: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    box-shadow: 0 18px 30px rgba(37, 99, 235, 0.25);
  }

  .orders-logout {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.16);
  }

  .orders-nav-icon,
  .orders-summary-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 0.1);
  }

  .orders-nav-icon svg,
  .orders-summary-icon svg,
  .orders-add-button svg,
  .orders-search svg,
  .orders-icon-button svg,
  .orders-close-button svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .orders-main {
    width: 100%;
    min-width: 0;
    margin-left: 280px;
    padding: 34px;
    animation: ordersFadeIn 420ms ease both;
  }

  .orders-header {
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

  .orders-eyebrow {
    margin-bottom: 10px;
    color: #93c5fd;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .orders-header h1 {
    color: #ffffff;
    font-size: clamp(38px, 5vw, 58px);
    line-height: 1.02;
    font-weight: 850;
    letter-spacing: 0;
  }

  .orders-subtitle {
    margin-top: 12px;
    color: #cbd5e1;
    font-size: 16px;
    line-height: 1.6;
  }

  .orders-add-button,
  .orders-save-button,
  .orders-cancel-button,
  .orders-icon-button,
  .orders-close-button {
    border: 0;
    cursor: pointer;
    font: inherit;
    font-weight: 800;
    transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }

  .orders-add-button {
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

  .orders-add-button:hover,
  .orders-save-button:hover,
  .orders-icon-button:hover,
  .orders-summary-card:hover {
    transform: translateY(-2px);
  }

  .orders-add-button:hover,
  .orders-save-button:hover {
    background: #1d4ed8;
    box-shadow: 0 20px 38px rgba(37, 99, 235, 0.4);
  }

  .orders-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-top: 22px;
  }

  .orders-summary-card {
    min-height: 144px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 22px;
    padding: 20px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
    box-shadow: 0 22px 48px rgba(0, 0, 0, 0.22);
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .orders-summary-card::after {
    content: "";
    position: absolute;
    width: 116px;
    height: 116px;
    right: -42px;
    bottom: -48px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
  }

  .orders-summary-card:hover {
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.32);
  }

  .orders-summary-card p {
    color: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    font-weight: 850;
  }

  .orders-summary-card h2 {
    color: #ffffff;
    font-size: clamp(27px, 3vw, 36px);
    line-height: 1;
    font-weight: 900;
    letter-spacing: 0;
    margin-top: 8px;
    overflow-wrap: anywhere;
  }

  .orders-summary-blue {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }

  .orders-summary-orange {
    background: linear-gradient(135deg, #f59e0b, #ea580c);
  }

  .orders-summary-green {
    background: linear-gradient(135deg, #22c55e, #15803d);
  }

  .orders-summary-purple {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  }

  .orders-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 22px;
  }

  .orders-search {
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

  .orders-search:focus-within {
    border-color: rgba(37, 99, 235, 0.75);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .orders-search input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #ffffff;
    font: inherit;
    font-size: 15px;
  }

  .orders-search input::placeholder {
    color: #64748b;
  }

  .orders-count {
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

  .orders-card {
    margin-top: 22px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 22px;
    background: rgba(30, 41, 59, 0.92);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
    overflow: hidden;
  }

  .orders-table-wrap {
    width: 100%;
    max-height: calc(100vh - 470px);
    overflow: auto;
  }

  .orders-table {
    width: 100%;
    min-width: 980px;
    border-collapse: separate;
    border-spacing: 0;
    color: #e2e8f0;
    font-size: 14px;
  }

  .orders-table th {
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

  .orders-table td {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    font-weight: 650;
    vertical-align: middle;
  }

  .orders-table tbody tr {
    transition: background 160ms ease;
  }

  .orders-table tbody tr:nth-child(even) {
    background: rgba(15, 23, 42, 0.28);
  }

  .orders-table tbody tr:hover {
    background: rgba(37, 99, 235, 0.12);
  }

  .orders-price {
    color: #ffffff;
    font-weight: 900;
  }

  .orders-status-badge {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    border-radius: 999px;
    padding: 0 11px;
    font-size: 12px;
    font-weight: 900;
    white-space: nowrap;
  }

  .orders-status-pending {
    color: #fed7aa;
    background: rgba(245, 158, 11, 0.14);
    border: 1px solid rgba(245, 158, 11, 0.28);
  }

  .orders-status-delivered {
    color: #bbf7d0;
    background: rgba(34, 197, 94, 0.13);
    border: 1px solid rgba(34, 197, 94, 0.22);
  }

  .orders-status-cancelled {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.14);
    border: 1px solid rgba(239, 68, 68, 0.28);
  }

  .orders-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .orders-icon-button {
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

  .orders-edit-button {
    background: #2563eb;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.24);
  }

  .orders-edit-button:hover {
    background: #1d4ed8;
  }

  .orders-delete-button {
    background: #ef4444;
    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.2);
  }

  .orders-delete-button:hover {
    background: #dc2626;
    box-shadow: 0 16px 30px rgba(239, 68, 68, 0.28);
  }

  .orders-empty-row {
    color: #94a3b8;
    text-align: center;
  }

  .orders-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 22px;
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(8px);
    animation: ordersFadeIn 180ms ease both;
  }

  .orders-modal {
    width: min(100%, 620px);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 22px;
    padding: 24px;
    background: #1e293b;
    color: #ffffff;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.48);
  }

  .orders-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 22px;
  }

  .orders-modal h2 {
    color: #ffffff;
    font-size: 26px;
    font-weight: 850;
    letter-spacing: 0;
  }

  .orders-close-button {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .orders-close-button:hover {
    transform: rotate(4deg) scale(1.04);
    color: #ffffff;
    border-color: rgba(239, 68, 68, 0.42);
  }

  .orders-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .orders-field {
    display: grid;
    gap: 8px;
  }

  .orders-field-wide {
    grid-column: 1 / -1;
  }

  .orders-field span {
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 800;
  }

  .orders-field input,
  .orders-field select {
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

  .orders-field select option {
    background: #1e293b;
    color: #ffffff;
  }

  .orders-field input:focus,
  .orders-field select:focus {
    border-color: rgba(37, 99, 235, 0.8);
    background: rgba(15, 23, 42, 0.94);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .orders-field input::placeholder {
    color: #64748b;
  }

  .orders-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .orders-save-button,
  .orders-cancel-button {
    min-height: 44px;
    border-radius: 13px;
    padding: 0 18px;
  }

  .orders-save-button {
    color: #ffffff;
    background: #2563eb;
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.28);
  }

  .orders-cancel-button {
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .orders-cancel-button:hover {
    transform: translateY(-2px);
    color: #ffffff;
    border-color: rgba(148, 163, 184, 0.32);
  }

  @keyframes ordersFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1180px) {
    .orders-summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .orders-shell {
      display: block;
    }

    .orders-sidebar {
      position: sticky;
      top: 0;
      width: 100%;
      min-height: auto;
      padding: 14px;
      border-right: 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      gap: 14px;
    }

    .orders-brand {
      padding: 0 2px 14px;
    }

    .orders-nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .orders-logout {
      margin-top: 12px;
    }

    .orders-main {
      margin-left: 0;
      padding: 18px;
    }

    .orders-header,
    .orders-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .orders-add-button,
    .orders-search,
    .orders-count {
      width: 100%;
      justify-content: center;
    }

    .orders-table-wrap {
      max-height: none;
    }
  }

  @media (max-width: 580px) {
    .orders-nav-button,
    .orders-logout {
      padding: 0 10px;
      font-size: 13px;
    }

    .orders-nav-icon {
      width: 30px;
      height: 30px;
    }

    .orders-header,
    .orders-modal {
      padding: 18px;
    }

    .orders-summary-grid,
    .orders-form-grid {
      grid-template-columns: 1fr;
    }

    .orders-field-wide {
      grid-column: auto;
    }

    .orders-modal-actions {
      flex-direction: column;
    }

    .orders-save-button,
    .orders-cancel-button {
      width: 100%;
    }
  }
`;
