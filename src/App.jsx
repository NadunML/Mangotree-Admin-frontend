import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tag, UtensilsCrossed, ShoppingBag, LogOut, Menu, X, Bell, ChevronRight } from './icons';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import MenuItems from './pages/MenuItems';
import Orders from './pages/Orders';
import Login from './pages/Login';

// Import the security files you just created
import ProtectedRoute from './pages/ProtectedRoute';
import axiosInstance from './utils/axiosInstance';

// Brand Gradient (Sidebar + Form panels)
const SIDEBAR_BG = 'linear-gradient(175deg, #402110 0%, #b14d1b 45%, #a85738 100%)';

// Order Notification Toast
function OrderNotification({ order, onDismiss, onViewOrders }) {
  const [exiting, setExiting] = useState(false);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 280);
  };

  const handleView = () => {
    setExiting(true);
    setTimeout(() => { onDismiss(); onViewOrders(); }, 280);
  };

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] w-80 select-none ${exiting ? 'notification-exit' : 'notification-enter'}`}
      onClick={handleDismiss}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden cursor-pointer group hover:shadow-orange-200/50 transition-shadow duration-300"
           style={{ boxShadow: '0 8px 32px rgba(249,115,22,0.18), 0 2px 8px rgba(0,0,0,0.08)' }}>

        <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-400" />

        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                <Bell className="w-4 h-4 text-orange-500" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">New Order!</p>
                <p className="text-sm font-extrabold text-stone-900 leading-tight">
                  #{String(order.id).padStart(4, '0')} Received
                </p>
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleDismiss(); }}
              className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-stone-500 font-medium">Order Total</span>
              <span className="text-sm font-extrabold text-stone-900">
                Rs. {Number(order.total_amount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">Items</span>
              <span className="text-xs font-bold text-orange-500">
                {order.items?.length || '—'} {order.items?.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            {order.pickup_time && (
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-stone-500 font-medium">Pickup</span>
                <span className="text-xs font-bold text-amber-600">{order.pickup_time}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); handleView(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors"
            >
              View Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleDismiss(); }}
              className="px-3 py-2 border border-stone-200 text-stone-500 text-xs font-semibold rounded-xl hover:bg-stone-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <p className="text-[10px] text-stone-400 text-center">Click anywhere to dismiss</p>
        </div>
      </div>
    </div>
  );
}

// Sidebar Link
function SidebarLink({ to, icon: Icon, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
          : 'text-amber-100/60 hover:text-white hover:bg-white/8'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />}
    </Link>
  );
}

// Main Layout
function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false);
  const [notification, setNotification]           = useState(null);
  const lastOrderIdRef                            = useRef(null);
  const navigate                                  = useNavigate();
  const user                                      = JSON.parse(localStorage.getItem('user'));
  const closeMobileMenu                           = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Poll for new orders securely using axiosInstance
  const pollOrders = useCallback(async () => {
    try {
      // Replaced raw axios with axiosInstance to ensure tokens are sent
      const res = await axiosInstance.get('/orders');
      const orders = res.data;
      if (!orders || orders.length === 0) return;

      const latest = orders.reduce((max, o) => (o.id > max.id ? o : max), orders[0]);

      if (lastOrderIdRef.current === null) {
        lastOrderIdRef.current = latest.id;
      } else if (latest.id > lastOrderIdRef.current) {
        lastOrderIdRef.current = latest.id;
        setNotification(latest);
      }
    } catch (e) {
      console.error('Order poll error:', e);
    }
  }, []);

  useEffect(() => {
    pollOrders();
    const interval = setInterval(pollOrders, 10000);
    return () => clearInterval(interval);
  }, [pollOrders]);

  const navItems = [
    { to: '/',     icon: LayoutDashboard, label: 'Dashboard'  },
    { to: '/orders',     icon: ShoppingBag,     label: 'Orders'     },
    { to: '/categories', icon: Tag,             label: 'Categories' },
    { to: '/menu-items', icon: UtensilsCrossed, label: 'Menu Items' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5 border-b border-amber-900/30">
        <div className="flex items-center gap-3">
          <img src="/favicon.png" alt="MangoTree" className="h-9 w-9 object-contain flex-shrink-0" />
          <div>
            <p className="text-base font-extrabold text-white leading-none tracking-tight">
              Mango<span className="text-orange-400">Tree</span>
            </p>
            <span className="text-[10px] font-bold text-orange-400/70 tracking-[0.15em] uppercase">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-amber-900/30">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-amber-900/40">
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate leading-tight">{user?.name || 'Admin'}</p>
            <p className="text-xs text-amber-200/50 font-medium mt-0.5">Administrator</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
        </div>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] font-bold text-amber-200/30 uppercase tracking-[0.15em] px-4 mb-3">Navigation</p>
        {navItems.map(item => (
          <SidebarLink key={item.to} to={item.to} icon={item.icon} label={item.label} onClick={closeMobileMenu} />
        ))}
      </div>

      <div className="px-3 pb-5">
        <div className="h-px bg-amber-900/30 mb-4" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-200/50 hover:text-white hover:bg-white/8 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-orange-400 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans antialiased" style={{ background: '#FAF9F6' }}>
      {notification && (
        <OrderNotification
          order={notification}
          onDismiss={() => setNotification(null)}
          onViewOrders={() => navigate('/orders')}
        />
      )}

      <div className="md:hidden fixed top-0 left-0 right-0 h-14 z-20 flex items-center justify-between px-4 bg-white border-b border-stone-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="" className="h-7 w-7 object-contain" />
          <p className="text-base font-extrabold text-stone-900">Mango<span className="text-orange-500">Tree</span></p>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={closeMobileMenu}>
          <div className="fixed inset-y-0 left-0 w-72 z-40 shadow-2xl"
               style={{ background: SIDEBAR_BG }}
               onClick={e => e.stopPropagation()}>
            <button onClick={closeMobileMenu} className="absolute top-4 right-4 text-amber-200/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="hidden md:flex flex-col w-60 flex-shrink-0 border-r border-amber-900/30"
           style={{ background: SIDEBAR_BG }}>
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden md:pt-0 pt-14">
        <div className="hidden md:flex items-center justify-between h-16 px-8 bg-white border-b border-stone-200 flex-shrink-0 shadow-sm">
          <PageLabel />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-bold tracking-[0.12em] uppercase text-orange-600">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Admin System Live
          </div>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-5 md:p-8" style={{ background: '#FAF9F6' }}>
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/"           element={<Dashboard />} />
              <Route path="/orders"     element={<Orders />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/menu-items" element={<MenuItems />} />
              <Route path="*"           element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function PageLabel() {
  const location = useLocation();
  const labels = {
    '/':           { sup: 'Overview',   title: 'Dashboard'       },
    '/orders':     { sup: 'Operations', title: 'Customer Orders' },
    '/categories': { sup: 'Management', title: 'Categories'      },
    '/menu-items': { sup: 'Management', title: 'Menu Items'      },
  };
  const pg = labels[location.pathname] || labels['/'];
  return (
    <div>
      <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.15em]">{pg.sup}</p>
      <h1 className="text-stone-900 font-extrabold text-lg leading-tight">{pg.title}</h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;