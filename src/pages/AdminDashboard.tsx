import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.ts";
import { IProduct } from "../types/index.ts";
import { Plus, Edit, Trash2, Package, ExternalLink, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "in" | "out">("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    api.getProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setError("No se pudieron cargar los productos. Por favor, intenta de nuevo.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.deleteProduct(id);
        loadProducts();
      } catch (err) {
        console.error(err);
        alert("Error al eliminar el producto");
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSize = !filterSize || product.variations?.some(v => v.size === filterSize);
    const matchesColor = !filterColor || product.variations?.some(v => v.color === filterColor);
    
    const totalStock = product.variations?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
    const matchesStock = filterStock === "all" || 
                        (filterStock === "in" && totalStock > 0) || 
                        (filterStock === "out" && totalStock === 0);

    return matchesSearch && matchesSize && matchesColor && matchesStock;
  });

  // Unique sizes and colors for filters
  const allSizes = Array.from(new Set(products.flatMap(p => p.variations?.map(v => v.size) || []))).filter(Boolean);
  const allColors = Array.from(new Set(products.flatMap(p => p.variations?.map(v => v.color) || []))).filter(Boolean);

  if (loading) return <div className="p-12 text-center">Cargando panel...</div>;

  if (error) return (
    <div className="p-12 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button 
        onClick={loadProducts}
        className="bg-stone-900 text-white px-6 py-2 rounded-xl"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif mb-2">Panel de Gestión</h1>
          <p className="text-stone-500">Administra el inventario de MIMARTE</p>
        </div>
        <Link 
          to="/admin/new" 
          className="w-full md:w-auto bg-stone-900 text-white px-6 py-4 md:py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border transition-all ${
              showFilters || filterSize || filterColor || filterStock !== "all"
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-100 hover:bg-stone-50"
            }`}
          >
            <Filter size={18} />
            <span>Filtros</span>
            {(filterSize || filterColor || filterStock !== "all") && (
              <span className="w-5 h-5 bg-white text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center ml-1">
                !
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-stone-50 rounded-[24px] border border-stone-100">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Talle</label>
                  <select
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl focus:outline-none text-sm"
                  >
                    <option value="">Todos los talles</option>
                    {allSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Color</label>
                  <select
                    value={filterColor}
                    onChange={(e) => setFilterColor(e.target.value)}
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl focus:outline-none text-sm"
                  >
                    <option value="">Todos los colores</option>
                    {allColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Disponibilidad</label>
                  <select
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value as any)}
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl focus:outline-none text-sm"
                  >
                    <option value="all">Todo el stock</option>
                    <option value="in">Con stock</option>
                    <option value="out">Sin stock</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterSize("");
                      setFilterColor("");
                      setFilterStock("all");
                    }}
                    className="w-full p-3 text-stone-400 hover:text-stone-900 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <X size={16} />
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-stone-100 overflow-hidden shadow-sm mb-20 md:mb-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-bold text-stone-400">Producto</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-bold text-stone-400">Precio</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-bold text-stone-400">Stock Total</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-bold text-stone-400">Variaciones</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-bold text-stone-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredProducts.map((product) => {
                const totalStock = product.variations?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
                const firstImage = product.images?.[0] || "https://picsum.photos/seed/placeholder/800/1000";
                
                return (
                  <motion.tr 
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-stone-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                          <img src={firstImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="font-medium text-stone-900">{product.title || "Sin título"}</div>
                          <div className="text-xs text-stone-400 truncate max-w-[200px]">{product.description || "Sin descripción"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-serif text-lg">${(product.price || 0).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Package size={14} className={totalStock > 0 ? "text-green-500" : "text-red-500"} />
                        <span className={totalStock > 0 ? "text-stone-900" : "text-red-500 font-bold"}>
                          {totalStock} unidades
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1">
                        {product.variations?.map((v, i) => (
                          <span key={i} className="px-2 py-0.5 bg-stone-100 text-[10px] rounded-md text-stone-600">
                            {v.size}/{v.color}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/product/${product._id}`} 
                          target="_blank"
                          className="p-2 text-stone-400 hover:text-stone-900 hover:bg-white rounded-lg border border-transparent hover:border-stone-100 transition-all"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          to={`/admin/edit/${product._id}`} 
                          className="p-2 text-stone-400 hover:text-stone-900 hover:bg-white rounded-lg border border-transparent hover:border-stone-100 transition-all"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-white rounded-lg border border-transparent hover:border-stone-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-stone-100">
          {filteredProducts.map((product) => {
            const totalStock = product.variations?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
            const firstImage = product.images?.[0] || "https://picsum.photos/seed/placeholder/800/1000";
            
            return (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0">
                    <img src={firstImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-stone-900 text-lg truncate">{product.title || "Sin título"}</div>
                    <div className="text-sm text-stone-500 line-clamp-2 mb-1">{product.description || "Sin descripción"}</div>
                    <div className="font-serif text-xl text-stone-900">${(product.price || 0).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full">
                    <Package size={14} className={totalStock > 0 ? "text-green-500" : "text-red-500"} />
                    <span className={`text-sm ${totalStock > 0 ? "text-stone-700" : "text-red-500 font-bold"}`}>
                      {totalStock} unidades
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.variations?.slice(0, 3).map((v, i) => (
                      <span key={i} className="px-2 py-0.5 bg-stone-100 text-[10px] rounded-md text-stone-600">
                        {v.size}/{v.color}
                      </span>
                    ))}
                    {(product.variations?.length || 0) > 3 && (
                      <span className="text-[10px] text-stone-400">+{product.variations!.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Link 
                    to={`/product/${product._id}`} 
                    target="_blank"
                    className="flex flex-col items-center justify-center gap-1 p-3 bg-stone-50 text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    <ExternalLink size={20} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Ver</span>
                  </Link>
                  <Link 
                    to={`/admin/edit/${product._id}`} 
                    className="flex flex-col items-center justify-center gap-1 p-3 bg-stone-50 text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    <Edit size={20} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Editar</span>
                  </Link>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="flex flex-col items-center justify-center gap-1 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={20} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Borrar</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-stone-400">
            {products.length === 0 
              ? "No hay productos registrados. Comienza creando uno nuevo."
              : "No se encontraron productos con los filtros aplicados."}
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button */}
      <Link 
        to="/admin/new" 
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-2xl z-40 active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </Link>
    </div>
  );
}
