import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import MenuItems from './pages/MenuItems';
import Orders from './pages/Orders';
import Login from './pages/Login';

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl mb-1.5 font-semibold transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
          : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600 hover:translate-x-0.5'
      }`}
    >
      <span className={`transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {children}
      </span>
      {isActive && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />}
    </Link>
  );
}

function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <img src="/favicon.png" alt="MangoTree" className="h-10 w-10 object-contain flex-shrink-0" />
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-gray-900 leading-none">
              Mango<span className="text-orange-500">Tree</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
              Admin Panel
            </span>
          </div>
        </div>

        {/* User card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-orange-500/20 flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 font-medium">Head Administrator</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-lime-400 ring-2 ring-lime-100 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="px-4 flex-1">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Navigation</p>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>

        <NavLink to="/" onClick={closeMobileMenu}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/categories" onClick={closeMobileMenu}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          <span>Categories</span>
        </NavLink>

        <NavLink to="/menu-items" onClick={closeMobileMenu}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span>Menu Items</span>
        </NavLink>

        <NavLink to="/orders" onClick={closeMobileMenu}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <span>Orders</span>
        </NavLink>
      </div>

      {/* Logout */}
      <div className="p-5 mt-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-200/40 p-4">
          <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-red-200/30 blur-2xl" />
          <button
            onClick={handleLogout}
            className="relative w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-bold text-red-600 hover:text-red-700 bg-white/70 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-red-200/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden antialiased">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md shadow-sm z-20 flex items-center justify-between px-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="MangoTree" className="h-8 w-8 object-contain" />
          <h2 className="text-lg font-extrabold text-gray-900">Mango<span className="text-orange-500">Tree</span></h2>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-gray-500 hover:text-orange-500 focus:outline-none p-2 -mr-2 rounded-xl hover:bg-orange-50 transition-colors duration-200"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 transition-opacity duration-300" onClick={closeMobileMenu}>
          <div
            className="fixed inset-y-0 left-0 w-[300px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-40 rounded-r-3xl"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={closeMobileMenu} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[280px] bg-white/90 backdrop-blur-sm border-r border-gray-100/80 shadow-sm z-10 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden md:pt-0 pt-16">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8 w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/menu-items" element={<MenuItems />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;