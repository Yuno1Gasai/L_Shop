import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../api/models/types';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-black/5 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-700">
      <div className="aspect-[4/5] relative bg-[#F8FAFC] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
            <span className="bg-black text-white text-[10px] font-bold px-5 py-2 rounded-2xl uppercase tracking-[0.2em] shadow-xl">
              Ожидается
            </span>
          </div>
        )}
        <div className="absolute top-6 left-6">
          <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-bold px-4 py-2 rounded-2xl uppercase tracking-widest shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-10">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-black mb-2 tracking-tight" data-title>
            {product.title}
          </h3>
          <span className="text-3xl font-black text-black" data-price>
            {product.price.toLocaleString()} BYN
          </span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed mb-10 line-clamp-2">
          {product.description}
        </p>
        <button
          onClick={() => addToCart(product.id)}
          disabled={!product.available}
          className={cn(
            "w-full py-5 rounded-3xl text-sm font-bold transition-all shadow-lg",
            product.available 
              ? "bg-black text-white hover:bg-[#E0F2FE] hover:text-black shadow-black/10" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          )}
        >
          {product.available ? "Добавить в корзину" : "Нет в наличии"}
        </button>
      </div>
    </div>
  );
};
