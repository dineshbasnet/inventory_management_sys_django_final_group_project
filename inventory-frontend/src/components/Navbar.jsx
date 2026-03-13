import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, Bell, User } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200
      flex items-center justify-between px-4 md:px-6 h-16 shadow-sm">

      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-2 md:gap-4">

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-500
            hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>

      </div>
    </header>
  );
}