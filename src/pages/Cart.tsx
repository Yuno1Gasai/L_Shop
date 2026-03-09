import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../api/models/types';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then((data: Product[]) => {
        const map = data.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        setProducts(map);
      });
  }, []);

  const total = cart.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <div className="w-28 h-28 bg-[#E0F2FE] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-blue-100">
          <User className="h-12 w-12 text-black" />
        </div>
        <h2 className="text-5xl font-black text-black mb-6 tracking-tight">Вход в систему</h2>
        <p className="text-xl text-gray-400 mb-12 font-medium">Авторизуйтесь, чтобы управлять своими заказами и корзиной.</p>
        <Link to="/auth" className="bg-black text-white px-12 py-5 rounded-3xl font-bold hover:bg-[#E0F2FE] hover:text-black transition-all shadow-2xl shadow-black/10">
          Войти в аккаунт
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <div className="w-28 h-28 bg-[#DCFCE7] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-100">
          <ShoppingBag className="h-12 w-12 text-black" />
        </div>
        <h2 className="text-5xl font-black text-black mb-6 tracking-tight">Корзина пуста</h2>
        <p className="text-xl text-gray-400 mb-12 font-medium">Ваш список покупок пока не содержит новых гаджетов.</p>
        <Link to="/" className="text-black font-bold text-lg hover:text-[#3B82F6] transition-colors underline underline-offset-8">
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16">
        <h1 className="text-6xl font-black text-black mb-4 tracking-tighter">Ваша корзина</h1>
        <p className="text-xl text-gray-400 font-medium">Вы выбрали {cart.length} устройства</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => {
            const product = products[item.productId];
            if (!product) return null;

            return (
              <div key={item.productId} className="bg-white p-10 rounded-[3rem] border border-black/5 flex flex-col sm:flex-row items-center gap-10 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="w-40 h-40 bg-[#F8FAFC] rounded-[2rem] overflow-hidden shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-black tracking-tight" data-title="basket">{product.title}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">{product.category}</p>
                    </div>
                    <p className="text-3xl font-black text-black" data-price="basket">{ (product.price * item.quantity).toLocaleString() } BYN</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex items-center bg-[#F8FAFC] rounded-2xl p-1.5 border border-black/5">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-lg transition-all text-black"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="font-bold w-16 text-center text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-lg transition-all text-black"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-sm font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[3.5rem] border border-black/5 shadow-2xl shadow-black/5 sticky top-32">
            <h2 className="text-3xl font-bold text-black mb-10 tracking-tight">Итог заказа</h2>
            <div className="space-y-8 mb-12">
              <div className="flex justify-between text-lg font-medium">
                <span className="text-gray-400">Сумма</span>
                <span className="text-black">{total.toLocaleString()} BYN</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span className="text-gray-400">Доставка</span>
                <span className="text-[#10B981] font-bold">Бесплатно</span>
              </div>
              <div className="pt-10 border-t border-black/5 flex justify-between items-baseline">
                <span className="text-xl font-bold text-black">Всего</span>
                <span className="text-3xl font-black text-black tracking-tighter">{total.toLocaleString()} BYN</span>
              </div>
            </div>
            <button className="w-full bg-black text-white py-6 rounded-[2rem] font-bold text-lg hover:bg-[#E0F2FE] hover:text-black transition-all shadow-2xl shadow-black/10">
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
