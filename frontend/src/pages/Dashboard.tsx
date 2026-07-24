import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { canAccessNav } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    recentOrders: [] as any[],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const revenue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(stats.revenue);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Customers", path: "/customers", icon: <CustomersIcon /> },
    { label: "Products", path: "/products", icon: <ProductsIcon /> },
    { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
    { label: "Sales Challans", path: "/sales-challans", icon: <OrdersIcon /> },
  ].filter((item) => canAccessNav(item.label));

  const statCards = [
    {
      label: "Customers",
      value: stats.customers,
      helper: "Active CRM records",
      icon: <CustomersIcon />,
      className: "dashboard-card dashboard-card-blue",
    },
    {
      label: "Products",
      value: stats.products,
      helper: "Items in catalog",
      icon: <ProductsIcon />,
      className: "dashboard-card dashboard-card-green",
    },
    {
      label: "Orders",
      value: stats.orders,
      helper: "Total order volume",
      icon: <OrdersIcon />,
      className: "dashboard-card dashboard-card-orange",
    },
    {
      label: "Revenue",
      value: revenue,
      helper: "Total business revenue",
      icon: <RevenueIcon />,
      className: "dashboard-card dashboard-card-purple",
    },
  ];

  return (
    <>
      <style>{dashboardStyles}</style>

      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div>
            <div className="dashboard-brand">
              <span className="dashboard-brand-mark">M</span>
              <div>
                <h2>Mini ERP</h2>
                <p>CRM Admin</p>
              </div>
            </div>

            <nav className="dashboard-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`dashboard-nav-button${
                    item.path === "/dashboard" ? " active" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="dashboard-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            className="dashboard-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <span className="dashboard-nav-icon">
              <LogoutIcon />
            </span>
            <span>Logout</span>
          </button>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <p className="dashboard-eyebrow">Professional SaaS Overview</p>
              <h1>Mini ERP CRM Dashboard</h1>
              <p className="dashboard-subtitle">
                Welcome back. Track customers, products, orders, and revenue
                from one clean workspace.
              </p>
            </div>

            <div className="dashboard-hero-chip">
              <span className="dashboard-chip-dot"></span>
              Live business snapshot
            </div>
          </section>

          <section className="dashboard-stats-grid" aria-label="Dashboard stats">
            {statCards.map((card) => (
              <article className={card.className} key={card.label}>
                <div className="dashboard-card-top">
                  <span className="dashboard-card-icon">{card.icon}</span>
                  <span className="dashboard-card-trend">Updated</span>
                </div>

                <div>
                  <p>{card.label}</p>
                  <h2>{card.value}</h2>
                  <span>{card.helper}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <p className="dashboard-eyebrow">Latest activity</p>
                <h2>Recent Orders</h2>
              </div>
              <button
                className="dashboard-primary-button"
                onClick={() => navigate("/orders")}
              >
                View Orders
              </button>
            </div>

            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order: any, index: number) => (
                      <tr key={index}>
                        <td>{order.customer_name}</td>
                        <td>{order.product_name}</td>
                        <td>{order.quantity}</td>
                        <td>
                          <span className="dashboard-status-badge">
                            {order.order_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="dashboard-empty-row" colSpan={4}>
                        No recent orders to display.
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

function RevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2h8v2H8V9Zm0 4h5v2H8v-2Z" />
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

const dashboardStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    background: #0f172a;
  }

  .dashboard-shell {
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

  .dashboard-sidebar {
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

  .dashboard-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 8px 28px;
  }

  .dashboard-brand-mark {
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

  .dashboard-brand h2,
  .dashboard-brand p,
  .dashboard-hero h1,
  .dashboard-panel h2,
  .dashboard-card h2,
  .dashboard-card p,
  .dashboard-card span {
    margin: 0;
  }

  .dashboard-brand h2 {
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0;
  }

  .dashboard-brand p {
    color: #94a3b8;
    font-size: 13px;
    margin-top: 2px;
  }

  .dashboard-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .dashboard-nav-button,
  .dashboard-logout {
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

  .dashboard-nav-button:hover,
  .dashboard-logout:hover {
    transform: translateX(4px);
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(148, 163, 184, 0.18);
    color: #ffffff;
  }

  .dashboard-nav-button.active {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(139, 92, 246, 0.9));
    border-color: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    box-shadow: 0 18px 30px rgba(37, 99, 235, 0.25);
  }

  .dashboard-logout {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.16);
  }

  .dashboard-nav-icon,
  .dashboard-card-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 0.1);
  }

  .dashboard-nav-icon svg,
  .dashboard-card-icon svg {
    width: 19px;
    height: 19px;
    fill: currentColor;
  }

  .dashboard-main {
    width: 100%;
    min-width: 0;
    margin-left: 280px;
    padding: 34px;
    animation: dashboardFadeIn 420ms ease both;
  }

  .dashboard-hero {
    min-height: 168px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 24px;
    padding: 30px;
    background:
      linear-gradient(135deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.78)),
      linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(139, 92, 246, 0.16));
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .dashboard-eyebrow {
    margin: 0 0 10px;
    color: #93c5fd;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .dashboard-hero h1 {
    color: #ffffff;
    font-size: clamp(32px, 5vw, 54px);
    line-height: 1.02;
    font-weight: 850;
    letter-spacing: 0;
  }

  .dashboard-subtitle {
    max-width: 760px;
    margin: 14px 0 0;
    color: #cbd5e1;
    font-size: 16px;
    line-height: 1.65;
  }

  .dashboard-hero-chip {
    min-width: max-content;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(34, 197, 94, 0.24);
    border-radius: 999px;
    padding: 10px 14px;
    color: #bbf7d0;
    background: rgba(34, 197, 94, 0.1);
    font-size: 13px;
    font-weight: 800;
  }

  .dashboard-chip-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
  }

  .dashboard-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-top: 22px;
  }

  .dashboard-card {
    min-height: 190px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 22px;
    padding: 22px;
    color: #ffffff;
    overflow: hidden;
    position: relative;
    box-shadow: 0 22px 48px rgba(0, 0, 0, 0.22);
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .dashboard-card::after {
    content: "";
    position: absolute;
    width: 140px;
    height: 140px;
    right: -54px;
    bottom: -58px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
  }

  .dashboard-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.32);
  }

  .dashboard-card-blue {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }

  .dashboard-card-green {
    background: linear-gradient(135deg, #22c55e, #15803d);
  }

  .dashboard-card-orange {
    background: linear-gradient(135deg, #f59e0b, #ea580c);
  }

  .dashboard-card-purple {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  }

  .dashboard-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
  }

  .dashboard-card-trend {
    border-radius: 999px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.86);
    font-size: 12px;
    font-weight: 800;
  }

  .dashboard-card p {
    color: rgba(255, 255, 255, 0.78);
    font-size: 14px;
    font-weight: 800;
  }

  .dashboard-card h2 {
    color: #ffffff;
    font-size: clamp(30px, 4vw, 42px);
    line-height: 1;
    font-weight: 900;
    margin-top: 8px;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  .dashboard-card span {
    display: inline-block;
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    font-weight: 700;
  }

  .dashboard-panel {
    margin-top: 22px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 22px;
    background: rgba(30, 41, 59, 0.92);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
    overflow: hidden;
  }

  .dashboard-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 26px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  }

  .dashboard-panel h2 {
    color: #ffffff;
    font-size: 24px;
    font-weight: 850;
    letter-spacing: 0;
  }

  .dashboard-primary-button {
    min-height: 42px;
    border: 0;
    border-radius: 12px;
    padding: 0 18px;
    color: #ffffff;
    background: #2563eb;
    font: inherit;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.28);
    transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
  }

  .dashboard-primary-button:hover {
    transform: translateY(-2px);
    background: #1d4ed8;
    box-shadow: 0 18px 34px rgba(37, 99, 235, 0.36);
  }

  .dashboard-table-wrap {
    width: 100%;
    overflow: auto;
  }

  .dashboard-table {
    width: 100%;
    min-width: 720px;
    border-collapse: separate;
    border-spacing: 0;
    color: #e2e8f0;
    font-size: 14px;
  }

  .dashboard-table th {
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

  .dashboard-table td {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    font-weight: 650;
  }

  .dashboard-table tbody tr {
    transition: background 160ms ease;
  }

  .dashboard-table tbody tr:nth-child(even) {
    background: rgba(15, 23, 42, 0.28);
  }

  .dashboard-table tbody tr:hover {
    background: rgba(37, 99, 235, 0.12);
  }

  .dashboard-status-badge {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    border-radius: 999px;
    padding: 0 11px;
    color: #bbf7d0;
    background: rgba(34, 197, 94, 0.13);
    border: 1px solid rgba(34, 197, 94, 0.22);
    font-size: 12px;
    font-weight: 900;
  }

  .dashboard-empty-row {
    color: #94a3b8;
    text-align: center;
  }

  @keyframes dashboardFadeIn {
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
    .dashboard-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 820px) {
    .dashboard-shell {
      display: block;
    }

    .dashboard-sidebar {
      position: sticky;
      top: 0;
      width: 100%;
      min-height: auto;
      padding: 14px;
      border-right: 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      gap: 14px;
    }

    .dashboard-brand {
      padding: 0 2px 14px;
    }

    .dashboard-nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dashboard-logout {
      margin-top: 12px;
    }

    .dashboard-main {
      margin-left: 0;
      padding: 18px;
    }

    .dashboard-hero,
    .dashboard-panel-header {
      flex-direction: column;
      align-items: stretch;
    }

    .dashboard-hero {
      padding: 22px;
    }

    .dashboard-hero-chip,
    .dashboard-primary-button {
      width: 100%;
      justify-content: center;
    }

    .dashboard-stats-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .dashboard-nav-button,
    .dashboard-logout {
      padding: 0 10px;
      font-size: 13px;
    }

    .dashboard-nav-icon {
      width: 30px;
      height: 30px;
    }

    .dashboard-card,
    .dashboard-panel-header {
      padding: 18px;
    }
  }
`;
