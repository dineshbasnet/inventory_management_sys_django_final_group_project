import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import OrdersPage from './pages/orders/OrdersPage';
import StockPage from './pages/stock/StockPage';
import ReportsPage from './pages/reports/ReportsPage';
import UsersPage from './pages/users/UsersPage';
import CategoriesPage from './pages/products/CategoriesPage';

/**
 * Enhanced PrivateWrapper
 * Uses <Outlet /> to render child routes inside the Layout
 */
const PrivateWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes Group */}
          <Route element={<PrivateWrapper />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />


          
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersPage/>} />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;