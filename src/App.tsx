import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Catalog from "./pages/Catalog.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminProductForm from "./pages/AdminProductForm.tsx";
import Login from "./pages/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { ShoppingBag, LayoutDashboard, LogOut, LayoutGrid } from "lucide-react";
import { useCartStore } from "./store/cartStore.ts";

// Navbar Component
const Navbar = () => {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = localStorage.getItem("mimarte_admin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("mimarte_admin");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFCF9]/80 backdrop-blur-xl border-b border-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex justify-between items-center">
        <Link to="/" className="text-2xl sm:text-3xl font-serif italic tracking-tighter text-stone-900 group">
          MIMARTE
          <span className="text-rose-300 group-hover:text-rose-400 transition-colors">.</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-8">
          <Link 
            to="/catalog" 
            className="bg-rose-400 text-white px-4 py-2 sm:px-8 sm:py-3.5 rounded-full font-bold text-[10px] sm:text-sm hover:bg-rose-500 transition-all shadow-xl shadow-rose-100 flex items-center gap-2 group animate-pulse hover:animate-none"
          >
            <LayoutGrid size={16} className="sm:w-[18px] sm:h-[18px] group-hover:rotate-12 transition-transform" />
            <span>Catálogo ✨</span>
          </Link>

          {isAdmin ? (
            <button 
              onClick={handleLogout}
              className="text-stone-400 hover:text-rose-400 transition-colors flex items-center gap-2 text-sm font-bold"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          ) : (
            <Link to="/admin" className="text-stone-300 hover:text-rose-300 transition-colors flex items-center gap-2 text-sm font-bold">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline italic">Admin</span>
            </Link>
          )}
          
          <Link to="/cart" className="relative p-3 bg-rose-50 text-rose-400 hover:bg-rose-400 hover:text-white rounded-2xl transition-all shadow-sm">
            <ShoppingBag size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#FFFCF9]">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas Protegidas */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/new" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
            <Route path="/admin/edit/:id" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
          </Routes>
        </main>
        
        <footer className="border-t border-rose-50 py-16 sm:py-24 mt-10 sm:mt-20 bg-white rounded-t-[40px] sm:rounded-t-[60px]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif italic mb-6 sm:mb-8 text-stone-900">MIMARTE<span className="text-rose-300">.</span></h2>
            <p className="text-stone-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed italic">
              "Buscamos y seleccionamos los diseños más copados para que tus momentos en casa sean pura diversión. El regalo perfecto está acá." 🎁🔥
            </p>
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-stone-50 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-stone-300 font-bold">
              © 2026 MIMARTE • Diseños con mucha onda para regalar
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <a 
          href="https://wa.me/5491122334455" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-green-200 hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <div className="absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-2xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¡Hola! ¿Te ayudo? 👋
          </div>
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </Router>
  );
}
