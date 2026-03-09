import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../api/models/types';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    if (availableOnly) params.append('available', 'true');

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort, availableOnly]);

  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-20">
        <div className="max-w-4xl mb-16">
          <h1 className="text-8xl font-black text-black mb-8 tracking-tighter leading-[0.9]">
            Технологии <br />
            <span className="text-[#3B82F6]">будущего</span> уже здесь.
          </h1>
          <p className="text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">
            Покупай с удовольствием: от высокоточных мышек до профессионального аудио. Только лучшие гаджеты для твоей продуктивности.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#F8FAFC] p-8 rounded-[3rem] border border-black/5">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск девайсов..."
              className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] transition-all text-sm font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <select
              className="bg-white rounded-3xl px-8 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] appearance-none cursor-pointer border border-black/5"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="bg-white rounded-3xl px-8 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#E0F2FE] appearance-none cursor-pointer border border-black/5"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Сортировка</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
            </select>

            <label className="flex items-center space-x-4 cursor-pointer bg-[#DCFCE7] rounded-3xl px-8 py-5">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg border-black/10 text-black focus:ring-0"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              <span className="text-sm font-bold text-black">В наличии</span>
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
