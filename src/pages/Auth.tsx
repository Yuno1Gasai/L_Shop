import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, LogIn, Mail, Lock, User, Phone, AtSign } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    login: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({ login: formData.login, password: formData.password });
      } else {
        await register(formData);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-32">
      <div className="bg-white p-16 rounded-[4rem] border border-black/5 shadow-2xl shadow-black/5">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-black mb-6 tracking-tighter">
            {isLogin ? 'С возвращением' : 'Создать профиль'}
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            {isLogin ? 'Войдите в систему управления девайсами' : 'Зарегистрируйтесь для доступа к эксклюзивным новинкам'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10" data-registration>
          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black mb-3 ml-6">Полное имя</label>
                <input
                  type="text"
                  required
                  className="w-full px-8 py-5 bg-[#F8FAFC] rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] transition-all text-sm font-bold"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-3 ml-6">Электронная почта</label>
                <input
                  type="email"
                  required
                  className="w-full px-8 py-5 bg-[#F8FAFC] rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] transition-all text-sm font-bold"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-3 ml-6">Телефон</label>
                <input
                  type="tel"
                  required
                  className="w-full px-8 py-5 bg-[#F8FAFC] rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] transition-all text-sm font-bold"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-black mb-3 ml-6">Имя пользователя</label>
              <input
                type="text"
                required
                className="w-full px-8 py-5 bg-[#F8FAFC] rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] transition-all text-sm font-bold"
                value={formData.login}
                onChange={e => setFormData({ ...formData, login: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-3 ml-6">Пароль</label>
              <input
                type="password"
                required
                className="w-full px-8 py-5 bg-[#F8FAFC] rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] transition-all text-sm font-bold"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-3xl">
              <p className="text-red-500 text-sm font-bold text-center">
                Ошибка системы: {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-6 rounded-[2rem] font-bold text-lg hover:bg-[#E0F2FE] hover:text-black transition-all shadow-2xl shadow-black/10"
          >
            {isLogin ? 'Войти в систему' : 'Завершить регистрацию'}
          </button>
        </form>

        <div className="mt-16 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
          >
            {isLogin ? "Нет аккаунта? Создать новый" : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};
