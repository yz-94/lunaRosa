import React from 'react';
import { ShoppingBag, ShoppingCart, Heart, Star } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, isFavorite, onToggleFavorite }) {
  const discountedPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all relative group max-w-sm mx-auto">
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          -{product.discount}% OFF
        </div>
      )}
      {product.isBestSeller && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          Best Seller
        </div>
      )}
      <button
        onClick={() => onToggleFavorite(product.id)}
        className="absolute top-10 right-2 bg-white p-1.5 rounded-full shadow-md z-10 hover:scale-110 transition-transform"
      >
        <Heart 
          size={18} 
          className={isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}
        />
      </button>
      
      <div className="h-56 bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <ShoppingBag className="text-pink-300" size={56} />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-800 mb-1 min-h-[40px] line-clamp-2">{product.name}</h3>
        
        {product.category && (
          <p className="text-xs text-gray-500 mb-2">{product.category}</p>
        )}
        
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-gray-400 line-through text-xs">${product.price.toLocaleString()}</span>
            )}
            <span className="text-xl font-bold text-pink-600">${discountedPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
          </div>
        </div>
        
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-purple-700 to-purple-900 text-white py-2.5 rounded-lg font-bold text-sm hover:from-purple-800 hover:to-purple-950 transition-all shadow-md flex items-center justify-center gap-2"
        >
          AGREGAR
          <ShoppingCart size={16} />
        </button>
      </div>
    </div>
  );
}