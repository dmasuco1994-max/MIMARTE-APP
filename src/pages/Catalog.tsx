import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.ts";
import { IProduct } from "../types/index.ts";
import { Search, Filter, X, ChevronDown, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Catalog() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  // Extract all unique sizes and colors for filters
  const { allSizes, allColors, highestPrice } = useMemo(() => {
    const sizes = new Set<string>();
    const colors = new Set<string>();
    let max = 0;
    
    products.forEach(p => {
      if (p.price > max) max = p.price;
      p.variations.forEach(v => {
        sizes.add(v.size);
        colors.add(v.color);
      });
    });
    
    return {
      allSizes: Array.from(sizes).sort(),
      allColors: Array.from(colors).sort(),
      highestPrice: max || 100000
    };
  }, [products]);

  useEffect(() => {
    if (highestPrice > 0) setMaxPrice(highestPrice);
  }, [highestPrice]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = p.price <= maxPrice;
      
      const productSizes = p.variations.map(v => v.size);
      const productColors = p.variations.map(v => v.color);
      
      const matchesSize = selectedSizes.length === 0 || selectedSizes.some(s => productSizes.includes(s));
      const matchesColor = selectedColors.length === 0 || selectedColors.some(c => productColors.includes(c));
      
      return matchesSearch && matchesPrice && matchesSize && matchesColor;
    });
  }, [products, search, maxPrice, selectedSizes, selectedColors]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(highestPrice);
    setSearch("");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-500 font-serif italic">Buscando los mejores diseños...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFCF9] pb-32">
      {/* Header - UX Playful */}
      <section className="bg-rose-50/50 py-16 sm:py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rose-400 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 block"
          >
            Catálogo MIMARTE ☁️
          </motion.span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-stone-900 mb-6 sm:mb-8 italic leading-tight">Todos los mimos</h1>
          <p className="text-stone-500 text-base sm:text-lg italic max-w-2xl mx-auto leading-relaxed">
            "Explorá nuestra colección curada de diseños divertidos. Encontrá ese pijama que habla de vos o el regalo perfecto para alguien especial."
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Search & Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            <input 
              type="text" 
              placeholder="Buscá tu diseño favorito..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 bg-white border border-stone-100 rounded-full text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-rose-200 shadow-sm italic text-sm sm:text-base"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 sm:py-5 rounded-full font-bold transition-all text-sm sm:text-base ${
              showFilters ? "bg-stone-900 text-white" : "bg-white text-stone-900 border border-stone-100 shadow-sm"
            }`}
          >
            <Filter size={18} />
            {showFilters ? "Cerrar Filtros" : "Filtrar"}
            {(selectedSizes.length > 0 || selectedColors.length > 0) && (
              <span className="bg-rose-400 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">
                {selectedSizes.length + selectedColors.length}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8 sm:mb-12"
            >
              <div className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 border border-stone-100 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                {/* Sizes */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 sm:mb-6">Talles</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {allSizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                          selectedSizes.includes(size) ? "bg-rose-400 text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 sm:mb-6">Colores</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {allColors.map(color => (
                      <button 
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                          selectedColors.includes(color) ? "bg-rose-400 text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400">Precio Máximo</h3>
                    <span className="text-stone-900 font-bold text-sm sm:text-base">${maxPrice.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={highestPrice} 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-rose-400 h-2 bg-stone-100 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-4 text-[9px] sm:text-[10px] text-stone-300 font-bold uppercase">
                    <span>$0</span>
                    <span>${highestPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="md:col-span-3 pt-4 sm:pt-6 border-t border-stone-50 flex justify-end">
                  <button 
                    onClick={clearFilters}
                    className="text-stone-400 hover:text-rose-400 text-xs sm:text-sm font-bold flex items-center gap-2"
                  >
                    <X size={14} className="sm:w-4 sm:h-4" />
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        <div className="mb-12 flex justify-between items-center px-4">
          <p className="text-stone-400 italic">
            Mostrando <span className="text-stone-900 font-bold">{filteredProducts.length}</span> diseños copados
          </p>
          {filteredProducts.length === 0 && (
            <button onClick={clearFilters} className="text-rose-400 font-bold text-sm underline">Ver todo</button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 4) * 0.1 }}
              >
                <Link to={`/product/${product._id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] sm:rounded-[48px] bg-stone-100 mb-6 sm:mb-8 shadow-sm group-hover:shadow-2xl group-hover:shadow-rose-100 transition-all duration-700">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-rose-500/5 transition-colors duration-700" />
                    
                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="bg-rose-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-xl whitespace-nowrap">
                        ¡Lo quiero!
                      </span>
                    </div>
                  </div>
                  <div className="px-2 sm:px-4">
                    <h3 className="text-xl sm:text-2xl font-serif mb-1 sm:mb-2 text-stone-900 group-hover:text-rose-400 transition-colors">{product.title}</h3>
                    <p className="text-xl sm:text-2xl font-light text-stone-400">${product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 sm:py-32 text-center bg-white rounded-[40px] sm:rounded-[60px] border border-stone-50 px-6">
            <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">🔎</div>
            <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4">No encontramos ese diseño...</h3>
            <p className="text-stone-400 italic max-w-md mx-auto text-sm sm:text-base">
              "Probá con otros filtros o buscá algo distinto. ¡Seguro encontrás algo que te encante!"
            </p>
            <button 
              onClick={clearFilters}
              className="mt-8 sm:mt-10 bg-rose-50 text-rose-400 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold hover:bg-rose-400 hover:text-white transition-all text-sm sm:text-base"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
