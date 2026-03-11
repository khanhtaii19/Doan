import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
// import WelcomePopup from './components/WelcomePopup';
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
import { Product, Category, Coupon, User, CartItem, Order, AppSettings, BlogPost as BlogPostType } from './types';
import { api } from './services';

type Page = 'home' | 'blog' | 'shop' | 'product-detail' | 'admin' | 'crm' | 'login' | 'checkout' | 'order-success' | 'orders' | 'order-detail';

// Map paymentMethod từ frontend sang enum backend chấp nhận
const mapPaymentMethod = (method: string): 'credit_card' | 'cash' | 'bank_transfer' => {
  if (method === 'cod') return 'cash';
  if (method === 'transfer') return 'bank_transfer';
  if (method === 'momo' || method === 'zalopay') return 'credit_card';
  return 'cash';
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showPopup, setShowPopup] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    product: { unit: 'Phần', allowComments: true },
    display: { defaultCategory: 'cat-1', imageOrientation: 'square' },
    inventory: { manageStock: true, lowStockAlert: true, alertEmail: 'admin@shop.com' }
  });

  // ─── Restore session từ token khi app khởi động ─────────
  useEffect(() => {
    const token = localStorage.getItem('shop_token');
    if (!token) return;
    api.getMe()
      .then((data) => {
        const u = data.data;
        setCurrentUser({
          ...u,
          id: u._id || u.id,
          avatar: u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=ff5c62&color=fff`
        });
      })
      .catch(() => {
        localStorage.removeItem('shop_token');
      });
  }, []);

  // ─── Load data từ backend, KHÔNG alert khi lỗi ──────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, couponsData, blogsData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getCoupons(),
          api.getBlogPosts()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setCoupons(couponsData);
        setBlogPosts(blogsData);
      } catch (error) {
        // Chỉ log, không alert để không block app
        console.error('Không thể tải dữ liệu từ backend:', error);
      }

      // getUsers có thể fail nếu chưa login — load riêng
      try {
        const usersData = await api.getUsers();
        setUsers(usersData);
      } catch {
        // bình thường nếu chưa auth
      }
    };
    loadData();
  }, []);

  // ─── Load orders khi user thay đổi ──────────────────────
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    api.getOrders()
      .then((data: Order[]) => {
        const userOrders = currentUser.role === 'admin'
          ? data
          : data.filter((o: Order) => o.userId === currentUser.id);
        setOrders(userOrders);
      })
      .catch((err: Error) => {
        console.error('Không thể tải đơn hàng:', err);
      });
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct, selectedOrder]);

  // ─── Handlers ───────────────────────────────────────────
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

  // Token được lưu TRƯỚC khi set user và navigate
  const handleLogin = (user: User, token: string) => {
    localStorage.setItem('shop_token', token);
    setCurrentUser(user);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOrders([]);
    localStorage.removeItem('shop_token');
    setCurrentPage('home');
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const stock = product.stock ?? 0;
    if (stock <= 0) { alert("Rất tiếc, món này đã hết."); return; }
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
        if (delta > 0 && newQty > stock) { alert(`Chỉ có thể mua được ${stock} phần món này.`); return item; }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Không thể cập nhật trạng thái:', err);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const sendEmailNotification = (order: Order) => {
    setTimeout(() => {
      alert(`📩 Email xác nhận đã gửi đến: ${order.customerInfo.email}`);
    }, 1500);
  };

  const handleCompleteOrder = async (customerInfo: any, paymentMethod: any) => {
    const subtotal = cart.reduce(
      (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0
    );
    const totalAmount = subtotal + 30000;

    // Payload khớp với Order schema của backend
    const orderPayload = {
      userId: currentUser?.id || 'guest',
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price
      })),
      totalAmount,
      finalAmount: totalAmount,
      // Map shippingAddress theo đúng schema backend
      shippingAddress: {
        street: customerInfo.addressDetail || '',
        city: customerInfo.district || '',
        state: customerInfo.province || '',
        zipCode: '700000',
        country: 'Vietnam'
      },
      // Lưu customerInfo đầy đủ vào notes để hiển thị UI
      notes: JSON.stringify({
        customerInfo,
        originalPaymentMethod: paymentMethod
      }),
      paymentMethod: mapPaymentMethod(paymentMethod),
      status: 'processing'
    };

    try {
      await api.createOrder(orderPayload);

      // Order cho UI giữ đầy đủ thông tin frontend cần
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        userId: currentUser?.id || 'guest',
        items: [...cart],
        totalAmount,
        customerInfo,
        paymentMethod,
        status: 'processing',
        createdAt: new Date().toISOString()
      };

      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, (p.stock || 0) - cartItem.quantity),
            totalSold: (p.totalSold || 0) + cartItem.quantity
          };
        }
        return p;
      }));

      setOrders(prev => [newOrder, ...prev]);
      setLatestOrder(newOrder);
      setCart([]);
      setCurrentPage('order-success');
      sendEmailNotification(newOrder);
    } catch (err) {
      console.error('Không thể tạo đơn hàng:', err);
      alert('Không thể đặt hàng. Vui lòng kiểm tra kết nối và thử lại.');
    }
  };

  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setCurrentPage('order-detail');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-red-100 selection:text-[#ff5c62]">
      {/* {showPopup && <WelcomePopup onClose={() => setShowPopup(false)} />} */}

      <Header
        onNavigate={handleNavigate}
        currentPage={currentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
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
        {currentPage === 'home' && (
          <Home onNavigateBlog={() => handleNavigate('blog')} blogPosts={blogPosts} products={products} />
        )}
        {currentPage === 'blog' && <BlogPost posts={blogPosts} />}
        {currentPage === 'shop' && (
          <Shop
            products={products}
            categories={categories}
            onViewDetail={(p) => { setSelectedProduct(p); setCurrentPage('product-detail'); }}
          />
        )}
        {currentPage === 'orders' && (
          <Orders
            orders={orders.filter(o => o.userId === currentUser?.id || o.userId === 'guest')}
            onViewDetail={handleViewOrderDetail}
          />
        )}
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
            products={products}
            categories={categories}
            coupons={coupons}
            settings={settings}
            orders={orders}
            onAddProduct={async (p) => {
              const created = await api.createProduct(p);
              setProducts([created, ...products]);
            }}
            onUpdateProduct={async (p) => {
              const updated = await api.updateProduct(p);
              setProducts(products.map(old => old.id === updated.id ? updated : old));
            }}
            onDeleteProduct={async (id) => {
              await api.deleteProduct(id);
              setProducts(products.filter(p => p.id !== id));
            }}
            onUpdateSettings={setSettings}
            onNavigateCRM={() => handleNavigate('crm')}
          />
        )}
        {currentPage === 'crm' && (
          <CRM users={users} orders={orders} onBack={() => handleNavigate('admin')} />
        )}
        {currentPage === 'login' && (
          <Login
            onLogin={(user, token) => handleLogin(user, token)}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {['home', 'shop', 'blog', 'orders', 'order-detail'].includes(currentPage) && <Footer />}
    </div>
  );
};

export default App;