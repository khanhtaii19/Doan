import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
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
import { Product, Category, Coupon, User, CartItem, Order, AppSettings, BlogPost as BlogPostType, ProductSize } from './types';
import { api } from './services';

type Page = 'home' | 'blog' | 'shop' | 'product-detail' | 'admin' | 'crm' | 'login' | 'checkout' | 'order-success' | 'orders' | 'order-detail';

const mapPaymentMethod = (method: string): 'credit_card' | 'cash' | 'bank_transfer' => {
  if (method === 'cod') return 'cash';
  if (method === 'transfer') return 'bank_transfer';
  if (method === 'momo' || method === 'zalopay') return 'credit_card';
  return 'cash';
};

const getSizePrice = (product: Product, size: ProductSize): number => {
  if (product.sizePrices) {
    return size === 'large' ? product.sizePrices.large : product.sizePrices.medium;
  }
  return product.salePrice || product.price;
};

const getCartItemKey = (productId: string, size: ProductSize): string => `${productId}-${size}`;

const mapDbOrderToFrontend = (dbOrder: any, products: Product[] = []): Order => {
  let customerInfo = dbOrder.customerInfo;
  if (!customerInfo || !customerInfo.name) {
    try {
      const parsed = JSON.parse(dbOrder.notes || '{}');
      customerInfo = parsed.customerInfo || {};
    } catch {
      customerInfo = {};
    }
  }

  let paymentMethod: Order['paymentMethod'] = 'cod';
  if (dbOrder.originalPaymentMethod) {
    paymentMethod = dbOrder.originalPaymentMethod as Order['paymentMethod'];
  } else {
    const pm = dbOrder.paymentMethod;
    if (pm === 'cash') paymentMethod = 'cod';
    else if (pm === 'bank_transfer') paymentMethod = 'transfer';
    else if (pm === 'credit_card') paymentMethod = 'momo';
  }

  const items: CartItem[] = (dbOrder.items || []).map((item: any) => {
    const matched = products.find(p => p.id === item.productId);
    const size: ProductSize = item.size === 'large' ? 'large' : 'medium';
    const unitPrice = Number(item.price || 0);
    return {
      product: {
        id: item.productId,
        name: item.productName || matched?.name || `Sản phẩm #${String(item.productId).slice(-4)}`,
        price: unitPrice,
        salePrice: unitPrice,
        image: item.productImage || matched?.image || '',
        categoryId: matched?.categoryId || '',
        description: matched?.description || '',
        details: matched?.details || '',
        stock: matched?.stock,
        totalSold: matched?.totalSold,
        sizePrices: matched?.sizePrices
      },
      quantity: item.quantity,
      size,
      unitPrice
    };
  });

  return {
    id: dbOrder._id || dbOrder.id,
    userId: dbOrder.userId,
    items,
    totalAmount: dbOrder.totalAmount,
    customerInfo: {
      name: customerInfo.name || '',
      phone: customerInfo.phone || '',
      email: customerInfo.email || '',
      province: customerInfo.province || '',
      district: customerInfo.district || '',
      ward: customerInfo.ward || '',
      addressDetail: customerInfo.addressDetail || ''
    },
    paymentMethod,
    status: dbOrder.status as Order['status'],
    createdAt: dbOrder.createdAt || new Date().toISOString()
  };
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
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
  // null = hiển thị danh sách blog, có giá trị = hiển thị chi tiết bài đó
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPostType | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    product: { unit: 'Phần', allowComments: true },
    display: { defaultCategory: 'cat-1', imageOrientation: 'square' },
    inventory: { manageStock: true, lowStockAlert: true, alertEmail: 'admin@shop.com' }
  });

  // ─── Restore session ─────────────────────────────────────
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
      .catch(() => localStorage.removeItem('shop_token'));
  }, []);

  // ─── Load data ───────────────────────────────────────────
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
        console.error('Không thể tải dữ liệu:', error);
      }
      try {
        const usersData = await api.getUsers();
        setUsers(usersData);
      } catch { /* chưa auth */ }
    };
    loadData();
  }, []);

  // ─── Load orders ─────────────────────────────────────────
  const loadOrders = async (user: User | null, productList: Product[] = products) => {
    if (!user) { setOrders([]); return; }
    try {
      const data: any[] = await api.getOrders();
      const mapped = data.map(o => mapDbOrderToFrontend(o, productList));
      const filtered = user.role === 'admin'
        ? mapped
        : mapped.filter(o => o.userId === user.id);
      setOrders(filtered);
    } catch (err) {
      console.error('Không thể tải đơn hàng:', err);
    }
  };

  useEffect(() => { loadOrders(currentUser); }, [currentUser]);

  useEffect(() => {
    if ((currentPage === 'orders' || currentPage === 'admin') && currentUser) {
      loadOrders(currentUser);
    }
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct, selectedOrder, selectedBlogPost]);

  // ─── Handlers ────────────────────────────────────────────

  // Navbar "Blog" → reset về danh sách (selectedBlogPost = null)
  const handleNavigate = (page: Page) => {
    if (page === 'admin' && currentUser?.role !== 'admin') {
      alert('Bạn không có quyền truy cập!');
      return;
    }
    // Khi click "Blog" trên navbar → luôn về danh sách
    if (page === 'blog') {
      setSelectedBlogPost(null);
    }
    setCurrentPage(page);
    if (page !== 'product-detail') setSelectedProduct(null);
    if (page !== 'order-detail') setSelectedOrder(null);
  };

  // Click một bài blog cụ thể (từ trang chủ hoặc từ danh sách blog)
  const handleSelectBlogPost = (post: BlogPostType | null) => {
    setSelectedBlogPost(post);
    setCurrentPage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    size: ProductSize = 'medium',
    unitPrice?: number
  ) => {
    const stock = product.stock ?? 0;
    if (stock <= 0) { alert('Rất tiếc, món này đã hết.'); return; }
    const finalUnitPrice = unitPrice ?? getSizePrice(product, size);
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      const currentInCart = existing ? existing.quantity : 0;
      const totalNew = currentInCart + quantity;
      if (totalNew > stock) {
        alert(`Chỉ còn ${stock} phần. Bạn đã có ${currentInCart} trong giỏ.`);
        return prev;
      }
      if (existing) {
        return prev.map(i => {
          if (i.product.id === product.id && i.size === size) {
            return { ...i, quantity: totalNew, unitPrice: finalUnitPrice };
          }
          return i;
        });
      }
      return [...prev, { product, quantity, size, unitPrice: finalUnitPrice }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemKey: string, delta: number) => {
    setCart(prev => prev.map(item => {
      const key = getCartItemKey(item.product.id, item.size);
      if (key !== cartItemKey) return item;
      const stock = item.product.stock ?? 0;
      const newQty = Math.max(1, item.quantity + delta);
      if (delta > 0 && newQty > stock) { alert(`Chỉ còn ${stock} phần.`); return item; }
      return { ...item, quantity: newQty };
    }));
  };

  const handleRemoveFromCart = (cartItemKey: string) => {
    setCart(prev => prev.filter(item => getCartItemKey(item.product.id, item.size) !== cartItemKey));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    } catch {
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const handleCompleteOrder = async (customerInfo: any, paymentMethod: any) => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity, 0
    );
    const totalAmount = subtotal + 30000;

    const orderPayload = {
      userId: currentUser?.id || 'guest',
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        size: item.size,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      totalAmount,
      finalAmount: totalAmount,
      customerInfo: {
        name: customerInfo.name || '',
        phone: customerInfo.phone || '',
        email: customerInfo.email || '',
        province: customerInfo.province || '',
        district: customerInfo.district || '',
        ward: customerInfo.ward || '',
        addressDetail: customerInfo.addressDetail || ''
      },
      shippingAddress: {
        street: customerInfo.addressDetail || '',
        city: customerInfo.district || '',
        state: customerInfo.province || '',
        zipCode: '700000',
        country: 'Vietnam'
      },
      originalPaymentMethod: paymentMethod,
      paymentMethod: mapPaymentMethod(paymentMethod),
      status: 'processing'
    };

    try {
      const savedOrder = await api.createOrder(orderPayload);

      const newOrder: Order = {
        id: savedOrder._id || savedOrder.id,
        userId: currentUser?.id || 'guest',
        items: [...cart],
        totalAmount,
        customerInfo,
        paymentMethod,
        status: 'processing',
        createdAt: savedOrder.createdAt || new Date().toISOString()
      };

      setProducts(prev => prev.map(p => {
        const ci = cart.find(i => i.product.id === p.id);
        if (!ci) return p;
        return { ...p, stock: Math.max(0, (p.stock || 0) - ci.quantity), totalSold: (p.totalSold || 0) + ci.quantity };
      }));

      setOrders(prev => [newOrder, ...prev]);
      setLatestOrder(newOrder);
      setCart([]);
      setCurrentPage('order-success');

      setTimeout(() => alert(`📩 Email xác nhận đã gửi đến: ${customerInfo.email}`), 1500);
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
          <Home
            onNavigateBlog={() => handleNavigate('blog')}
            onNavigateShop={() => handleNavigate('shop')}
            onNavigateBlogPost={handleSelectBlogPost}
            blogPosts={blogPosts}
            products={products}
          />
        )}
        {currentPage === 'blog' && (
          <BlogPost
            posts={blogPosts}
            selectedPost={selectedBlogPost}
            onSelectPost={handleSelectBlogPost}
          />
        )}
        {currentPage === 'shop' && (
          <Shop
            products={products}
            categories={categories}
            onViewDetail={(p) => { setSelectedProduct(p); setCurrentPage('product-detail'); }}
          />
        )}
        {currentPage === 'orders' && (
          <Orders
            orders={
              currentUser?.role === 'admin'
                ? orders
                : orders.filter(o => o.userId === currentUser?.id || o.userId === 'guest')
            }
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
