import React from 'react';
import { ShoppingBag, Eye, Package, ShoppingCart } from 'lucide-react';

export default function Header({ view, setView, cart, setShowCart }) {
  return (
    <header className="bg-white shadow-md border-b-4 border-pink-400 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-3 rounded-full">
              <ShoppingBag className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Luna Rosa</h1>
              <p className="text-pink-600 text-xs">Maquillaje y Belleza</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('catalog')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                view === 'catalog'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50'
              }`}
            >
              <Eye className="inline mr-1" size={16} />
              Tienda
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                view === 'admin'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50'
              }`}
            >
              <Package className="inline mr-1" size={16} />
              Admin
            </button>
            {view === 'catalog' && (
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-all shadow-lg"
              >
                <ShoppingCart className="inline mr-1" size={16} />
                Carrito
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}