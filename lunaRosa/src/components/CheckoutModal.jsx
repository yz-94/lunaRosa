import React from 'react';
import { X, Truck, CreditCard, Phone } from 'lucide-react';

export default function CheckoutModal({ cart, orderData, setOrderData, onClose, onConfirm, getTotal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-8">
        <div className="p-6 border-b-2 border-pink-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Finalizar Compra</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Datos de Contacto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    value={orderData.name}
                    onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                    placeholder="Ej: 3001234567"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email (opcional)</label>
                  <input
                    type="email"
                    value={orderData.email}
                    onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Dirección de Entrega *</label>
                  <textarea
                    value={orderData.address}
                    onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                    rows="3"
                    placeholder="Calle, número, barrio, ciudad"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Método de Pago</h3>
              <div className="space-y-3 mb-4">
                <button
                  onClick={() => setOrderData({...orderData, paymentMethod: 'efectivo'})}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    orderData.paymentMethod === 'efectivo'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-pink-500" size={24} />
                    <div>
                      <p className="font-semibold">Efectivo</p>
                      <p className="text-sm text-gray-600">Pago contra entrega</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setOrderData({...orderData, paymentMethod: 'transferencia'})}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    orderData.paymentMethod === 'transferencia'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="text-pink-500" size={24} />
                    <div>
                      <p className="font-semibold">Transferencia/Nequi/Daviplata</p>
                      <p className="text-sm text-gray-600">Te mostraremos los datos</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Notas adicionales</label>
                <textarea
                  value={orderData.notes}
                  onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                  rows="2"
                  placeholder="Ej: Dejar en portería, tocar timbre, etc."
                />
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Resumen del Pedido</h4>
                <div className="space-y-2">
                  {cart.map(item => {
                    const discountedPrice = item.discount > 0 
                      ? item.price * (1 - item.discount / 100)
                      : item.price;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-semibold">${(discountedPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t-2 border-pink-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-pink-600">${getTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-lg font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg text-lg"
          >
            <Truck className="inline mr-2" size={24} />
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}