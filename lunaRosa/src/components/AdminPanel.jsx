import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Eye, CreditCard, ShoppingBag } from 'lucide-react';

export default function AdminPanel({ products, banners, saveProducts, saveBanners }) {
  const [showForm, setShowForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [showPaymentConfig, setShowPaymentConfig] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    category: '',
    discount: '',
    isBestSeller: false
  });
  
  const [bannerData, setBannerData] = useState({
    image: '',
    title: '',
    subtitle: ''
  });
  
  const [localPaymentInfo, setLocalPaymentInfo] = useState({
    banco: 'Bancolombia',
    tipoCuenta: 'Ahorros',
    numeroCuenta: '',
    titular: '',
    nequi: '',
    daviplata: ''
  });

  const handleImageUpload = (e, isProduct = true) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000000) {
      alert('La imagen es muy grande. Por favor usa una imagen menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isProduct) {
        setFormData({...formData, image: reader.result});
      } else {
        setBannerData({...bannerData, image: reader.result});
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      alert('Por favor completa los campos obligatorios (Nombre, Precio, Stock, Categoría)');
      return;
    }

    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discount: formData.discount ? parseInt(formData.discount) : 0
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    saveProducts(updatedProducts);
    resetForm();
  };

  const handleBannerSubmit = () => {
    if (!bannerData.image) {
      alert('Por favor agrega una imagen');
      return;
    }

    const newBanner = {
      id: Date.now(),
      ...bannerData
    };

    const updatedBanners = [...banners, newBanner];
    saveBanners(updatedBanners);
    setBannerData({ image: '', title: '', subtitle: '' });
    setShowBannerForm(false);
  };

  const deleteBanner = (id) => {
    if (window.confirm('¿Eliminar este banner?')) {
      const updatedBanners = banners.filter(b => b.id !== id);
      saveBanners(updatedBanners);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás segura de eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image: product.image || '',
      stock: product.stock,
      category: product.category || '',
      discount: product.discount || '',
      isBestSeller: product.isBestSeller || false
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      stock: '',
      category: '',
      discount: '',
      isBestSeller: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const savePaymentConfig = () => {
    try {
      localStorage.setItem('luna-rosa-payment-info', JSON.stringify(localPaymentInfo));
      alert('Información de pago guardada correctamente');
      setShowPaymentConfig(false);
    } catch (error) {
      alert('Error al guardar la información');
    }
  };

  const loadPaymentConfig = () => {
    try {
      const data = localStorage.getItem('luna-rosa-payment-info');
      if (data) {
        setLocalPaymentInfo(JSON.parse(data));
      }
    } catch (error) {
      console.log('No hay información guardada');
    }
    setShowPaymentConfig(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Panel de Administración</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-500 text-white p-6 rounded-xl font-semibold hover:bg-pink-600 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <Plus size={24} />
          Agregar Producto
        </button>
        <button
          onClick={() => setShowBannerForm(true)}
          className="bg-purple-500 text-white p-6 rounded-xl font-semibold hover:bg-purple-600 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <Eye size={24} />
          Agregar Banner
        </button>
        <button
          onClick={loadPaymentConfig}
          className="bg-green-500 text-white p-6 rounded-xl font-semibold hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <CreditCard size={24} />
          Configurar Pago
        </button>
      </div>

      {showPaymentConfig && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Configurar Información de Pago</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Banco</label>
                <select
                  value={localPaymentInfo.banco}
                  onChange={(e) => setLocalPaymentInfo({...localPaymentInfo, banco: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                >
                  <option>Bancolombia</option>
                  <option>Davivienda</option>
                  <option>Banco de Bogotá</option>
                  <option>BBVA</option>
                  <option>Nequi</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tipo de Cuenta</label>
                <select
                  value={localPaymentInfo.tipoCuenta}
                  onChange={(e) => setLocalPaymentInfo({...localPaymentInfo, tipoCuenta: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                >
                  <option>Ahorros</option>
                  <option>Corriente</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Número de Cuenta</label>
              <input
                type="text"
                value={localPaymentInfo.numeroCuenta}
                onChange={(e) => setLocalPaymentInfo({...localPaymentInfo, numeroCuenta: e.target.value})}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Titular de la Cuenta</label>
              <input
                type="text"
                value={localPaymentInfo.titular}
                onChange={(e) => setLocalPaymentInfo({...localPaymentInfo, titular: e.target.value})}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                placeholder="Nombre completo del titular"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nequi (opcional)</label>
                <input
                  type="text"
                  value={localPaymentInfo.nequi}
                  onChange={(e) => setLocalPaymentInfo({...localPaymentInfo, nequi: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                  placeholder="3001234567"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Daviplata (opcional)</label>
                <input
                  type="text"
                  value={localPaymentInfo.daviplata}
                  onChange={(e) => setLocalPaymentInfo({...localPaymentInfo, daviplata: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                  placeholder="3001234567"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={savePaymentConfig}
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all"
              >
                Guardar Información
              </button>
              <button
                onClick={() => setShowPaymentConfig(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showBannerForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Nuevo Banner</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Imagen del Banner *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
              {bannerData.image && (
                <div className="mt-2">
                  <img src={bannerData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Tamaño recomendado: 1200x400px (máximo 5MB)</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Título (opcional)</label>
              <input
                type="text"
                value={bannerData.title}
                onChange={(e) => setBannerData({...bannerData, title: e.target.value})}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Subtítulo (opcional)</label>
              <input
                type="text"
                value={bannerData.subtitle}
                onChange={(e) => setBannerData({...bannerData, subtitle: e.target.value})}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBannerSubmit}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-all"
              >
                Guardar Banner
              </button>
              <button
                onClick={() => {
                  setShowBannerForm(false);
                  setBannerData({ image: '', title: '', subtitle: '' });
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {banners.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Banners Activos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(banner => (
              <div key={banner.id} className="relative rounded-lg overflow-hidden border-2 border-pink-200">
                <img src={banner.image} alt={banner.title} className="w-full h-32 object-cover" />
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
                {banner.title && (
                  <div className="p-2 bg-white">
                    <p className="font-semibold text-sm">{banner.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Categoría *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                  placeholder="Ej: Labiales, Bases, Sombras"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Stock *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Descuento (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Imagen del Producto</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
              {formData.image && (
                <div className="mt-2">
                  <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Tamaño recomendado: 500x500px (máximo 5MB)</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                rows="3"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bestSeller"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})}
                className="w-5 h-5"
              />
              <label htmlFor="bestSeller" className="text-gray-700 font-semibold">Marcar como Best Seller</label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-all"
              >
                {editingProduct ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <Package className="mx-auto text-pink-300 mb-4" size={64} />
          <p className="text-gray-500 text-xl">No hay productos en el inventario</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-pink-100">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Producto</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Categoría</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Precio</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Descuento</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Stock</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? 'bg-pink-50' : 'bg-white'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-pink-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="text-pink-400" size={24} />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{product.name}</div>
                        {product.isBestSeller && (
                          <span className="text-xs bg-pink-200 text-pink-700 px-2 py-1 rounded">Best Seller</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.category && (
                      <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                        {product.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">${product.price}</td>
                  <td className="px-6 py-4">
                    {product.discount > 0 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold">
                        -{product.discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
