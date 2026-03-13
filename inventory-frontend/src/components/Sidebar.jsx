import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Tag,
  Truck, ShoppingCart, Warehouse,
  BarChart3, User, Users, X,
  LogOut
} from 'lucide-react';

const getNavItems = (role) => {
  const items = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/categories', label: 'Categories', icon: Tag },
    { path: '/suppliers', label: 'Suppliers', icon: Truck },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/stock', label: 'Stock', icon: Warehouse },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];
  // Only admin sees Users page
  if (role === 'admin') {
    items.push({ path: '/users', label: 'Users', icon: Users });
  }
  return items;
};


export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navItems = getNavItems(user?.role);


  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Package size={22} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Inventory MS</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* User Profile Info */}
        <div className="px-4 py-5 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shrink-0 shadow-lg">
              <User size={20} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-0.5">
                {user?.role || 'Staff'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="text-sm font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
          <p className="text-[10px] text-gray-600 mt-4 px-4 text-center">v1.0.4  2026 Edition</p>
        </div>
      </aside>
    </>
  );
}