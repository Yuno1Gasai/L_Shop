import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-[#E0F2FE] rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Package className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-black">FutureShop2026</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/cart" className="relative group p-2">
              <ShoppingCart className="h-6 w-6 text-black group-hover:text-[#3B82F6] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-black">{user.login}</span>
                  <div className="w-10 h-10 bg-[#DCFCE7] rounded-2xl flex items-center justify-center">
                    <User className="h-5 w-5 text-black" />
                  </div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
                >
                  Выход
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-black text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-[#E0F2FE] hover:text-black transition-all shadow-lg shadow-black/5"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
