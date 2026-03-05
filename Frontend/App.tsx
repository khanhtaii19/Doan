
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import WelcomePopup from './components/WelcomePopup';
import Shop from './pages/Shop';
import ProductDetailView from './pages/ProductDetailView';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetailView from './pages/OrderDetailView';
import CartDrawer from './components/CartDrawer';
import CRM from './pages/CRM';
import { Product, Category, Coupon, User, CartItem, Order, AppSettings } from './types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_USERS } from './constants';

type Page = 'home' | 'blog' | 'shop' | 'product-detail' | 'admin' | 'crm' | 'login' | 'checkout' | 'order-success' | 'orders' | 'order-detail';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showPopup, setShowPopup] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // App Data State
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    product: { unit: 'Phần', allowComments: true },
    display: { defaultCategory: 'cat-1', imageOrientation: 'square' },
    inventory: { manageStock: true, lowStockAlert: true, alertEmail: 'admin@shop.com' }
  });

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('shop_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedOrders = localStorage.getItem('shop_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedProducts = localStorage.getItem('shop_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    localStorage.setItem('shop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct, selectedOrder]);

  // Handlers
  const handleNavigate = (page: Page) => {
    if (page === 'admin' && currentUser?.role !== 'admin') {
      alert('Bạn không có quyền truy cập vào khu vực này!');
      setCurrentPage('home');
      return;
    }
    setCurrentPage(page);
    if (page !== 'product-detail') setSelectedProduct(null);
    if (page !== 'order-detail') setSelectedOrder(null);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const stock = product.stock ?? 0;
    if (stock <= 0) {
      alert("Rất tiếc, món này đã hết.");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      const currentInCart = existing ? existing.quantity : 0;
      const totalNewQuantity = currentInCart + quantity;

      if (totalNewQuantity > stock) {
        alert(`Chỉ có thể mua được ${stock} phần món ăn này. Bạn đã có ${currentInCart} phần trong giỏ.`);
        return prev;
      }

      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: totalNewQuantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const stock = item.product.stock ?? 0;
        const newQty = Math.max(1, item.quantity + delta);
        if (delta > 0 && newQty > stock) {
           alert(`Chỉ có thể mua được ${stock} phần món này.`);
           return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const sendEmailNotification = (order: Order) => {
    console.log(`[Email System] Gửi email đến: ${order.customerInfo.email}`);
    setTimeout(() => {
      alert(`📩 HỆ THỐNG EMAIL:\n\nChúng tôi vừa gửi một email xác nhận đến địa chỉ: ${order.customerInfo.email}.\n\nCảm ơn bạn đã mua sắm!`);
    }, 1500);
  };

  const handleCompleteOrder = (customerInfo: any, paymentMethod: any) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      items: [...cart],
      totalAmount: cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0) + 30000,
      customerInfo,
      paymentMethod,
      status: 'processing',
      createdAt: new Date().toISOString()
    };

    setProducts(prev => prev.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, (p.stock || 0) - cartItem.quantity);
          const newSold = (p.totalSold || 0) + cartItem.quantity;
          return { ...p, stock: newStock, totalSold: newSold };
        }
        return p;
    }));

    setOrders([newOrder, ...orders]);
    setLatestOrder(newOrder);
    setCart([]);
    setCurrentPage('order-success');
    sendEmailNotification(newOrder);
  };

  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setCurrentPage('order-detail');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-red-100 selection:text-[#ff5c62]">
      {showPopup && <WelcomePopup onClose={() => setShowPopup(false)} />}
      
      <Header 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
        currentUser={currentUser}
        onLogout={() => { setCurrentUser(null); localStorage.removeItem('shop_user'); setCurrentPage('home'); }}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => { setIsCartOpen(false); handleNavigate('checkout'); }}
      />

      <main className="flex-grow bg-white">
        {currentPage === 'home' && <Home onNavigateBlog={() => handleNavigate('blog')} />}
        {currentPage === 'blog' && <BlogPost />}
        {currentPage === 'shop' && <Shop products={products} categories={categories} onViewDetail={(p) => { setSelectedProduct(p); setCurrentPage('product-detail'); }} />}
        {currentPage === 'orders' && <Orders orders={orders.filter(o => o.userId === currentUser?.id || o.userId === 'guest')} onViewDetail={handleViewOrderDetail} />}
        
        {currentPage === 'order-detail' && selectedOrder && (
          <OrderDetailView 
            order={selectedOrder} 
            onBack={() => setCurrentPage('orders')} 
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailView 
            product={selectedProduct} 
            coupons={coupons}
            onBack={() => handleNavigate('shop')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'checkout' && (
          <Checkout 
            items={cart} 
            user={currentUser} 
            onBack={() => handleNavigate('shop')}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onComplete={handleCompleteOrder}
          />
        )}

        {currentPage === 'order-success' && latestOrder && (
          <OrderSuccess 
            order={latestOrder} 
            onGoHome={() => handleNavigate('home')} 
            onGoOrders={() => handleNavigate('orders')} 
          />
        )}

        {currentPage === 'admin' && (
          <Admin 
            products={products} categories={categories} coupons={coupons} settings={settings} orders={orders}
            onAddProduct={(p) => setProducts([p, ...products])}
            onUpdateProduct={(p) => setProducts(products.map(old => old.id === p.id ? p : old))}
            onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
            onUpdateSettings={setSettings}
            onNavigateCRM={() => handleNavigate('crm')}
          />
        )}

        {currentPage === 'crm' && (
          <CRM 
            users={users}
            orders={orders}
            onBack={() => handleNavigate('admin')}
          />
        )}

        {currentPage === 'login' && <Login onLogin={(u) => { setCurrentUser(u); localStorage.setItem('shop_user', JSON.stringify(u)); setCurrentPage('home'); }} onBack={() => handleNavigate('home')} />}
      </main>

      {['home', 'shop', 'blog', 'orders', 'order-detail'].includes(currentPage) && <Footer />}
    </div>
  );
};

export default App;
