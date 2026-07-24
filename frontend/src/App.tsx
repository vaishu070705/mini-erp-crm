import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Customers from "./pages/Customers.tsx";
import CustomerDetails from "./pages/CustomerDetails.tsx";
import Products from "./pages/Products.tsx";
import Orders from "./pages/Orders.tsx";
import Challans from "./pages/Challans.tsx";
import ChallanForm from "./pages/ChallanForm.tsx";
import ChallanDetails from "./pages/ChallanDetails.tsx";
import StockHistory from "./pages/StockHistory.tsx";
import AccessDenied from "./pages/AccessDenied.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["Admin", "Sales", "Warehouse", "Accounts"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute allowedRoles={["Admin", "Sales"]}><Customers /></ProtectedRoute>} />
        <Route path="/customers/:id" element={<ProtectedRoute allowedRoles={["Admin", "Sales"]}><CustomerDetails /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute allowedRoles={["Admin", "Warehouse"]}><Products /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute allowedRoles={["Admin", "Sales", "Accounts"]}><Orders /></ProtectedRoute>} />
        <Route path="/sales-challans" element={<ProtectedRoute allowedRoles={["Admin", "Sales"]}><Challans /></ProtectedRoute>} />
        <Route path="/challans" element={<ProtectedRoute allowedRoles={["Admin", "Sales"]}><Challans /></ProtectedRoute>} />
        <Route path="/challans/new" element={<ProtectedRoute allowedRoles={["Admin", "Sales"]}><ChallanForm /></ProtectedRoute>} />
        <Route path="/challans/:id" element={<ProtectedRoute allowedRoles={["Admin", "Sales"]}><ChallanDetails /></ProtectedRoute>} />
        <Route path="/challans/:id/edit" element={<ProtectedRoute allowedRoles={["Admin", "Sales"]}><ChallanForm /></ProtectedRoute>} />
        <Route path="/stock-history" element={<ProtectedRoute allowedRoles={["Admin", "Warehouse"]}><StockHistory /></ProtectedRoute>} />
        <Route path="/stock-history/:productId" element={<ProtectedRoute allowedRoles={["Admin", "Warehouse"]}><StockHistory /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
