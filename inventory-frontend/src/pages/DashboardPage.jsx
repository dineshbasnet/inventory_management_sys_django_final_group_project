import { useEffect, useState } from 'react';
import { getDashboardAPI } from '../api/reports';
import { useAuth } from '../context/AuthContext';
import {
  Package, AlertTriangle, XCircle,
  ShoppingCart, DollarSign, TrendingUp,
  Warehouse, BarChart3, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, bgColor, textColor, border }) => (
  <div className={`bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 border-b-2 md:border-b-0 md:border-l-4 ${border} transition-all hover:shadow-md`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
      <Icon size={24} className={textColor} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : (value ?? 0)}
      </h3>
    </div>
  </div>
);

const quickActions = [
  { label: 'Add Product', icon: Package, path: '/products', color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-100' },
  { label: 'New Order', icon: ShoppingCart, path: '/orders', color: 'text-purple-600', bg: 'bg-purple-50', hover: 'hover:bg-purple-100' },
  { label: 'Manage Stock', icon: Warehouse, path: '/stock', color: 'text-green-600', bg: 'bg-green-50', hover: 'hover:bg-green-100' },
  { label: 'View Reports', icon: BarChart3, path: '/reports', color: 'text-amber-600', bg: 'bg-amber-50', hover: 'hover:bg-amber-100' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardAPI()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-800">{user?.first_name || 'Admin'}</span>.
          </p>
        </div>
        <div className="text-sm px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 shadow-sm self-start">
          System Status: <span className="text-green-500 font-medium">● Operational</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats?.total_products} icon={Package} bgColor="bg-blue-50" textColor="text-blue-600" border="border-blue-500" />
        <StatCard title="Out of Stock" value={stats?.out_of_stock} icon={XCircle} bgColor="bg-red-50" textColor="text-red-600" border="border-red-500" />
        <StatCard title="Low Stock Items" value={stats?.low_stock} icon={AlertTriangle} bgColor="bg-amber-50" textColor="text-amber-600" border="border-amber-500" />
        <StatCard title="Pending Orders" value={stats?.pending_orders} icon={ShoppingCart} bgColor="bg-purple-50" textColor="text-purple-600" border="border-purple-500" />
        <StatCard title="Inventory Value" value={`Rs ${stats?.total_inventory_value || 0}`} icon={DollarSign} bgColor="bg-emerald-50" textColor="text-emerald-600" border="border-emerald-500" />
        <StatCard title="Recent Movements" value={stats?.recent_movements} icon={TrendingUp} bgColor="bg-pink-50" textColor="text-pink-600" border="border-pink-500" />
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Quick Operations</h3>
          <span className="text-xs text-gray-400 font-medium uppercase">Frequent Tasks</span>
        </div>
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`group flex items-center gap-4 p-4 rounded-xl ${action.bg} ${action.hover} transition-all active:scale-95 border border-transparent hover:border-white/50`}
            >
              <div className={`p-2 rounded-lg bg-white shadow-sm ${action.color}`}>
                <action.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight">{action.label}</p>
                <p className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Launch →</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple Skeleton for better UX
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 w-48 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}
      </div>
      <div className="h-40 bg-gray-200 rounded-2xl" />
    </div>
  );
}