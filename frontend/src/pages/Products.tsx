import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { canAccessNav } from "../utils/auth";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product keeps the same API payload and defaults used by the existing page.
  const addProduct = async () => {
    try {
      await api.post("/products", {
        product_name: productName,
        sku: "SKU" + Date.now(),
        category: "Electronics",
        unit_price: Number(price),
        current_stock: Number(stock),
        minimum_stock_alert: 5,
        warehouse_location: "Warehouse A",
      });

      fetchProducts();

      setProductName("");
      setPrice("");
      setStock("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const updateProduct = async () => {
    try {
      await api.put(`/products/${editingId}`, {
        product_name: productName,
        unit_price: Number(price),
        current_stock: Number(stock),
      });

      fetchProducts();

      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);

      setProductName("");
      setPrice("");
      setStock("");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  const editProduct = (product: any) => {
    setEditingId(product.id);
    setIsEditing(true);
    setShowForm(true);

    setProductName(product.product_name);
    setPrice(String(product.unit_price));
    setStock(String(product.current_stock));
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Customers", path: "/customers", icon: <CustomersIcon /> },
    { label: "Products", path: "/products", icon: <ProductsIcon /> },
    { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
    { label: "Sales Challans", path: "/sales-challans", icon: <OrdersIcon /> },
    { label: "Stock History", path: "/stock-history", icon: <ProductsIcon /> },
  ].filter((item) => canAccessNav(item.label));

  return (
    <>
      <style>{productsStyles}</style>

      <div className="products-shell">
        <aside className="products-sidebar">
          <div>
            <div className="products-brand">
              <span className="products-brand-mark">M</span>
              <div>
                <h2>Mini ERP</h2>
                <p>CRM Admin</p>
              </div>
            </div>

            <nav className="products-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`products-nav-button${
                    item.path === "/products" ? " active" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="products-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            className="products-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <span className="products-nav-icon">
              <LogoutIcon />
            </span>
            <span>Logout</span>
          </button>
        </aside>

        <main className="products-main">
          <section className="products-header">
            <div>
              <p className="products-eyebrow">Inventory Workspace</p>
              <h1>Products</h1>
              <p className="products-subtitle">
                Manage product catalog, pricing, and stock levels.
              </p>
            </div>

            <button
              className="products-add-button"
              onClick={() => setShowForm(true)}
            >
              <PlusIcon />
              Add Product
            </button>
          </section>

          <section className="products-toolbar">
            <label className="products-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <span className="products-count">
              {filteredProducts.length} products
            </span>
          </section>

          <section className="products-card">
            <div className="products-table-wrap">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <div className="products-name-cell">
                            <span className="products-avatar">
                              {product.product_name?.charAt(0)?.toUpperCase() ||
                                "P"}
                            </span>
                            <span>{product.product_name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="products-price">
                            ₹{product.unit_price}
                          </span>
                        </td>
                        <td>
                          <span className="products-stock-badge">
                            {product.current_stock} in stock
                          </span>
                        </td>
                        <td>
                          <div className="products-actions">
                            <button
                              className="products-icon-button products-history-button"
                              onClick={() =>
                                navigate(`/stock-history/${product.id}`)
                              }
                            >
                              History
                            </button>

                            <button
                              className="products-icon-button products-edit-button"
                              onClick={() => editProduct(product)}
                            >
                              <PencilIcon />
                              Edit
                            </button>

                            <button
                              className="products-icon-button products-delete-button"
                              onClick={() => deleteProduct(product.id)}
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
                      <td className="products-empty-row" colSpan={5}>
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {showForm && (
          <div className="products-modal-backdrop">
            <div className="products-modal">
              <div className="products-modal-header">
                <div>
                  <p className="products-eyebrow">
                    {isEditing ? "Update item" : "New item"}
                  </p>
                  <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
                </div>

                <button
                  className="products-close-button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close product form"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="products-form-grid">
                <label className="products-field products-field-wide">
                  <span>Product Name</span>
                  <input
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </label>

                <label className="products-field">
                  <span>Price</span>
                  <input
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </label>

                <label className="products-field">
                  <span>Stock</span>
                  <input
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </label>
              </div>

              <div className="products-modal-actions">
                <button
                  className="products-save-button"
                  onClick={isEditing ? updateProduct : addProduct}
                >
                  {isEditing ? "Update" : "Save"}
                </button>

                <button
                  className="products-cancel-button"
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

const productsStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    background: #0f172a;
  }

  .products-shell {
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

  .products-sidebar {
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

  .products-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 8px 28px;
  }

  .products-brand-mark {
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

  .products-brand h2,
  .products-brand p,
  .products-header h1,
  .products-header p,
  .products-modal h2,
  .products-eyebrow {
    margin: 0;
  }

  .products-brand h2 {
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0;
  }

  .products-brand p {
    color: #94a3b8;
    font-size: 13px;
    margin-top: 2px;
  }

  .products-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .products-nav-button,
  .products-logout {
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

  .products-nav-button:hover,
  .products-logout:hover {
    transform: translateX(4px);
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(148, 163, 184, 0.18);
    color: #ffffff;
  }

  .products-nav-button.active {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(139, 92, 246, 0.9));
    border-color: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    box-shadow: 0 18px 30px rgba(37, 99, 235, 0.25);
  }

  .products-logout {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.16);
  }

  .products-nav-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 0.1);
  }

  .products-nav-icon svg,
  .products-add-button svg,
  .products-search svg,
  .products-icon-button svg,
  .products-close-button svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .products-main {
    width: 100%;
    min-width: 0;
    margin-left: 280px;
    padding: 34px;
    animation: productsFadeIn 420ms ease both;
  }

  .products-header {
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

  .products-eyebrow {
    margin-bottom: 10px;
    color: #93c5fd;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .products-header h1 {
    color: #ffffff;
    font-size: clamp(34px, 5vw, 54px);
    line-height: 1.02;
    font-weight: 850;
    letter-spacing: 0;
  }

  .products-subtitle {
    margin-top: 12px;
    color: #cbd5e1;
    font-size: 16px;
    line-height: 1.6;
  }

  .products-add-button,
  .products-save-button,
  .products-cancel-button,
  .products-icon-button,
  .products-close-button {
    border: 0;
    cursor: pointer;
    font: inherit;
    font-weight: 800;
    transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }

  .products-add-button {
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

  .products-add-button:hover,
  .products-save-button:hover,
  .products-icon-button:hover {
    transform: translateY(-2px);
  }

  .products-add-button:hover,
  .products-save-button:hover {
    background: #1d4ed8;
    box-shadow: 0 20px 38px rgba(37, 99, 235, 0.4);
  }

  .products-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 22px;
  }

  .products-search {
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

  .products-search:focus-within {
    border-color: rgba(37, 99, 235, 0.75);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .products-search input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #ffffff;
    font: inherit;
    font-size: 15px;
  }

  .products-search input::placeholder {
    color: #64748b;
  }

  .products-count {
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

  .products-card {
    margin-top: 22px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 22px;
    background: rgba(30, 41, 59, 0.92);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
    overflow: hidden;
  }

  .products-table-wrap {
    width: 100%;
    max-height: calc(100vh - 310px);
    overflow: auto;
  }

  .products-table {
    width: 100%;
    min-width: 780px;
    border-collapse: separate;
    border-spacing: 0;
    color: #e2e8f0;
    font-size: 14px;
  }

  .products-table th {
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

  .products-table td {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    font-weight: 650;
    vertical-align: middle;
  }

  .products-table tbody tr {
    transition: background 160ms ease;
  }

  .products-table tbody tr:nth-child(even) {
    background: rgba(15, 23, 42, 0.28);
  }

  .products-table tbody tr:hover {
    background: rgba(37, 99, 235, 0.12);
  }

  .products-name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #ffffff;
  }

  .products-avatar {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: inline-grid;
    place-items: center;
    color: #ffffff;
    background: linear-gradient(135deg, #22c55e, #2563eb);
    font-size: 13px;
    font-weight: 900;
    box-shadow: 0 12px 24px rgba(34, 197, 94, 0.2);
  }

  .products-price {
    color: #ffffff;
    font-weight: 900;
  }

  .products-stock-badge {
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
    white-space: nowrap;
  }

  .products-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .products-icon-button {
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

  .products-edit-button {
    background: #2563eb;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.24);
  }

  .products-history-button {
    background: #8b5cf6;
    box-shadow: 0 12px 24px rgba(139, 92, 246, 0.22);
  }

  .products-history-button:hover {
    background: #7c3aed;
  }

  .products-edit-button:hover {
    background: #1d4ed8;
  }

  .products-delete-button {
    background: #ef4444;
    box-shadow: 0 12px 24px rgba(239, 68, 68, 0.2);
  }

  .products-delete-button:hover {
    background: #dc2626;
    box-shadow: 0 16px 30px rgba(239, 68, 68, 0.28);
  }

  .products-empty-row {
    color: #94a3b8;
    text-align: center;
  }

  .products-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 22px;
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(8px);
    animation: productsFadeIn 180ms ease both;
  }

  .products-modal {
    width: min(100%, 520px);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 22px;
    padding: 24px;
    background: #1e293b;
    color: #ffffff;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.48);
  }

  .products-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 22px;
  }

  .products-modal h2 {
    color: #ffffff;
    font-size: 26px;
    font-weight: 850;
    letter-spacing: 0;
  }

  .products-close-button {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .products-close-button:hover {
    transform: rotate(4deg) scale(1.04);
    color: #ffffff;
    border-color: rgba(239, 68, 68, 0.42);
  }

  .products-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .products-field {
    display: grid;
    gap: 8px;
  }

  .products-field-wide {
    grid-column: 1 / -1;
  }

  .products-field span {
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 800;
  }

  .products-field input {
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

  .products-field input:focus {
    border-color: rgba(37, 99, 235, 0.8);
    background: rgba(15, 23, 42, 0.94);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .products-field input::placeholder {
    color: #64748b;
  }

  .products-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .products-save-button,
  .products-cancel-button {
    min-height: 44px;
    border-radius: 13px;
    padding: 0 18px;
  }

  .products-save-button {
    color: #ffffff;
    background: #2563eb;
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.28);
  }

  .products-cancel-button {
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .products-cancel-button:hover {
    transform: translateY(-2px);
    color: #ffffff;
    border-color: rgba(148, 163, 184, 0.32);
  }

  @keyframes productsFadeIn {
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
    .products-shell {
      display: block;
    }

    .products-sidebar {
      position: sticky;
      top: 0;
      width: 100%;
      min-height: auto;
      padding: 14px;
      border-right: 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      gap: 14px;
    }

    .products-brand {
      padding: 0 2px 14px;
    }

    .products-nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .products-logout {
      margin-top: 12px;
    }

    .products-main {
      margin-left: 0;
      padding: 18px;
    }

    .products-header,
    .products-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .products-add-button,
    .products-search,
    .products-count {
      width: 100%;
      justify-content: center;
    }

    .products-table-wrap {
      max-height: none;
    }
  }

  @media (max-width: 580px) {
    .products-nav-button,
    .products-logout {
      padding: 0 10px;
      font-size: 13px;
    }

    .products-nav-icon {
      width: 30px;
      height: 30px;
    }

    .products-header,
    .products-modal {
      padding: 18px;
    }

    .products-form-grid {
      grid-template-columns: 1fr;
    }

    .products-field-wide {
      grid-column: auto;
    }

    .products-modal-actions {
      flex-direction: column;
    }

    .products-save-button,
    .products-cancel-button {
      width: 100%;
    }
  }
`;
