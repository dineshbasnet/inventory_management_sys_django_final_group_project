import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900
      flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">

        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-2xl
            flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Package size={28} className="text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Inventory Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600
            px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'} value={password} required
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
              text-white font-semibold rounded-lg transition-colors text-sm
              flex items-center justify-center gap-2 mt-2">
            {loading
              ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              : <><LogIn size={18} /> Sign In</>
            }
          </button>

        </form>
      </div>
    </div>
  );
}