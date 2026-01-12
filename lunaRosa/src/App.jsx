import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Package, ShoppingCart, Search } from 'lucide-react';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import ProductCard from './components/ProductCard';
import ShoppingCartModal from './components/ShoppingCartModal';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [view, setView] = useState('catalog');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    banco: 'Bancolombia',
    tipoCuenta: 'Ahorros',
    numeroCuenta: '',
    titular: '',
    nequi: '',
    daviplata: ''
  });
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'efectivo',
    notes: ''
  });

  useEffect(() => {
    loadData();
    loadPaymentInfo();
  }, []);

  const loadData = async () => {
    try {
      const [productsResult, bannersResult, cartResult, favoritesResult] = await Promise.all([
        window.storage.get('luna-rosa-products').catch(() => null),
        window.storage.get('luna-rosa-banners').catch(() => null),
        window.storage.get('luna-rosa-cart').catch(() => null),
        window.storage.get('luna-rosa-favorites').catch(() => null)
      ]);

      if (productsResult?.value) setProducts(JSON.parse(productsResult.value));
      if (bannersResult?.value) setBanners(JSON.parse(bannersResult.value));
      if (cartResult?.value) setCart(JSON.parse(cartResult.value));
      if (favoritesResult?.value) setFavorites(JSON.parse(favoritesResult.value));
    } catch (error) {
      console.log('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentInfo = async () => {
    try {
      const result = await window.storage.get('luna-rosa-payment-info');
      if (result?.value) {
        setPaymentInfo(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No hay información de pago guardada');
    }
  };

  const saveProducts = async (updatedProducts) => {
    try {
      await window.storage.set('luna-rosa-products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los productos');
    }
  };

  const saveBanners = async (updatedBanners) => {
    try {
      await window.storage.set('luna-rosa-banners', JSON.stringify(updatedBanners));
      setBanners(updatedBanners);
    } catch (error) {
      console.error('Error al guardar banners:', error);
    }
  };

  const saveCart = async (updatedCart) => {
    try {
      await window.storage.set('luna-rosa-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  };

  const saveFavorites = async (updatedFavorites) => {
    try {
      await window.storage.set('luna-rosa-favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  };

  const toggleFavorite = (productId) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    saveFavorites(updatedFavorites);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('No hay más stock disponible');
        return;
      }
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    
    saveCart(updatedCart);
    setShowCart(true);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
      alert('No hay suficiente stock');
      return;
    }
    
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = item.discount > 0 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (discountedPrice * item.quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!orderData.name || !orderData.phone || !orderData.address) {
      alert('Por favor completa todos los campos requeridos:\n- Nombre completo\n- Teléfono\n- Dirección de entrega');
      return;
    }

    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: orderData,
      items: cart,
      total: getCartTotal(),
      status: 'pendiente'
    };

    try {
      const ordersResult = await window.storage.get('luna-rosa-orders').catch(() => null);
      const orders = ordersResult?.value ? JSON.parse(ordersResult.value) : [];
      orders.push(order);
      await window.storage.set('luna-rosa-orders', JSON.stringify(orders));

      const updatedProducts = products.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
          return { ...product, stock: product.stock - cartItem.quantity };
        }
        return product;
      });
      await saveProducts(updatedProducts);

      await window.storage.set('luna-rosa-cart', JSON.stringify([]));
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      
      if (orderData.paymentMethod === 'transferencia') {
        let mensaje = '¡Pedido realizado con éxito! 🎉\n\n';
        mensaje += '📱 INFORMACIÓN DE PAGO:\n\n';
        
        if (paymentInfo.numeroCuenta) {
          mensaje += `💳 ${paymentInfo.banco}\n`;
          mensaje += `Tipo: ${paymentInfo.tipoCuenta}\n`;
          mensaje += `Cuenta: ${paymentInfo.numeroCuenta}\n`;
          mensaje += `Titular: ${paymentInfo.titular}\n\n`;
        }
        
        if (paymentInfo.nequi) {
          mensaje += `📲 Nequi: ${paymentInfo.nequi}\n`;
        }
        
        if (paymentInfo.daviplata) {
          mensaje += `📲 Daviplata: ${paymentInfo.daviplata}\n`;
        }
        
        mensaje += `\nTotal a pagar: $${getCartTotal()}\n\n`;
        mensaje += 'Por favor realiza la transferencia y envíanos el comprobante. Te contactaremos pronto para confirmar tu compra.';
        
        alert(mensaje);
      } else {
        alert('¡Pedido realizado con éxito! 🎉\n\nPago contra entrega: $' + getCartTotal() + '\n\nTe contactaremos pronto para coordinar la entrega.');
      }
      
      setOrderData({
        name: '',
        phone: '',
        email: '',
        address: '',
        paymentMethod: 'efectivo',
        notes: ''
      });
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      alert('Error al procesar el pedido. Por favor intenta de nuevo.');
    }
  };

  const categories = ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const productsByCategory = categories.reduce((acc, category) => {
    if (category === 'Todos') return acc;
    acc[category] = filteredProducts.filter(p => p.category === category);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-pink-600 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <Header 
        view={view}
        setView={setView}
        cart={cart}
        setShowCart={setShowCart}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'catalog' ? (
          <div>
            {banners.length > 0 && (
              <BannerSlider banners={banners} />
            )}

            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                        : 'bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="mx-auto text-pink-300 mb-4" size={64} />
                <p className="text-gray-500 text-xl">No se encontraron productos</p>
              </div>
            ) : selectedCategory === 'Todos' ? (
              Object.keys(productsByCategory).map(category => (
                productsByCategory[category].length > 0 && (
                  <div key={category} className="mb-12">
                    <div className="flex items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                        {category}
                      </h2>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-pink-300 to-transparent ml-4"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productsByCategory[category].map(product => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          onAddToCart={addToCart}
                          isFavorite={favorites.includes(product.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <AdminPanel
            products={products}
            banners={banners}
            saveProducts={saveProducts}
            saveBanners={saveBanners}
          />
        )}
      </main>

      {showCart && (
        <ShoppingCartModal
          cart={cart}
          products={products}
          onClose={() => setShowCart(false)}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
          updateQuantity={updateCartQuantity}
          removeItem={removeFromCart}
          getTotal={getCartTotal}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          orderData={orderData}
          setOrderData={setOrderData}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleCheckout}
          getTotal={getCartTotal}
        />
      )}
    </div>
  );
}