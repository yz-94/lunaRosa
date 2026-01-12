import React from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';

export default function ShoppingCartModal({ cart, products, onClose, onCheckout, updateQuantity, removeItem, getTotal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b-2 border-pink-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Tu Carrito</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-pink-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => {
                const discountedPrice = item.discount > 0 
                  ? item.price * (1 - item.discount / 100)
                  : item.price;
                
                return (
                  <div key={item.id} className="flex gap-4 bg-pink-50 p-4 rounded-lg">
                    <div className="w-20 h-20 bg-pink-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingCart className="text-pink-400" size={32} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        {item.discount > 0 && (
                          <span className="text-gray-400 line-through text-sm">${item.price}</span>
                        )}
                        <span className="text-pink-600 font-semibold">${discountedPrice.toFixed(2)}</span>
                        {item.discount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-pink-500 text-white w-8 h-8 rounded-lg hover:bg-pink-600 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-pink-500 text-white w-8 h-8 rounded-lg hover:bg-pink-600 font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">${(discountedPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-6 border-t-2 border-pink-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-pink-600">${getTotal()}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}