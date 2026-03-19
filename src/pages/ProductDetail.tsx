import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api.ts";
import { IProduct, IVariation } from "../types/index.ts";
import { useCartStore } from "../store/cartStore.ts";
import { ChevronLeft, ShoppingCart, Check, X, Ruler, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<IVariation | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getProduct(id).then(async (data) => {
        setProduct(data);
        // Fetch related products
        const all = await api.getProducts();
        const productsArray = Array.isArray(all) ? all : [];
        setRelatedProducts(productsArray.filter(p => p._id !== id).slice(0, 4));
      }).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando producto...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  const handleAddToCart = () => {
    if (!selectedVariation) {
      alert("Por favor selecciona talle y color");
      return;
    }
    addItem({
      ...product,
      selectedVariation,
      quantity: 1
    });
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:py-24">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-stone-400 hover:text-rose-400 transition-colors mb-8 sm:mb-12 font-bold text-xs sm:text-sm group">
        <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform" />
        Volver al catálogo
      </Link>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] sm:rounded-[60px] p-8 sm:p-12 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 p-2 text-stone-300 hover:text-rose-400 transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-8 sm:mb-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-rose-400">
                  <Ruler size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">Guía de Talles</h2>
              </div>

              <p className="text-stone-500 italic mb-8 sm:mb-10 text-sm sm:text-base">
                "Queremos que tu pijama te quede perfecto. Acá tenés las medidas de referencia para elegir tranquila."
              </p>

              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left border-collapse min-w-[300px]">
                  <thead>
                    <tr className="border-b border-stone-100">
                      <th className="py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400">Talle</th>
                      <th className="py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400">Pecho (cm)</th>
                      <th className="py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400">Cintura (cm)</th>
                      <th className="py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400">Cadera (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-stone-600 text-sm sm:text-base">
                    {[
                      { t: "S", p: "85-90", c: "65-70", ca: "90-95" },
                      { t: "M", p: "90-95", c: "70-75", ca: "95-100" },
                      { t: "L", p: "95-100", c: "75-80", ca: "100-105" },
                      { t: "XL", p: "100-110", c: "80-90", ca: "105-115" }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-stone-50 hover:bg-rose-50/30 transition-colors">
                        <td className="py-3 sm:py-4 font-bold text-stone-900">{row.t}</td>
                        <td className="py-3 sm:py-4 italic">{row.p}</td>
                        <td className="py-3 sm:py-4 italic">{row.c}</td>
                        <td className="py-3 sm:py-4 italic">{row.ca}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 sm:mt-10 p-5 sm:p-6 bg-rose-50 rounded-[24px] sm:rounded-[32px] flex items-start gap-4">
                <span className="text-xl sm:text-2xl">💡</span>
                <p className="text-[10px] sm:text-xs text-rose-700 leading-relaxed font-medium">
                  Tip: Si estás entre dos talles, te recomendamos elegir el más grande para mayor comodidad al dormir. ¡Nuestros pijamas son de calce relajado!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 lg:gap-32">
        {/* Galería de Imágenes - UX Cozy */}
        <div className="space-y-6 sm:space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[3/4] rounded-[40px] sm:rounded-[60px] overflow-hidden bg-rose-50 shadow-2xl shadow-rose-100/50"
          >
            <img 
              src={product.images[selectedImage] || "https://picsum.photos/seed/mimarte/800/1000"} 
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[24px] overflow-hidden bg-stone-50 border-2 transition-all ${
                  selectedImage === i ? "border-rose-400 scale-105 shadow-lg shadow-rose-100" : "border-stone-100 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Info - Tono Relajado */}
        <div className="flex flex-col justify-center">
          <div className="mb-8 sm:mb-12">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-rose-400 font-bold mb-4 sm:mb-6 block"
            >
              MIMARTE • Diseños con mucha onda 🔥
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-4 sm:mb-6 leading-tight text-stone-900">{product.title}</h1>
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <p className="text-3xl sm:text-4xl font-serif text-stone-900">${product.price.toLocaleString()}</p>
              <span className="px-3 py-1 sm:px-4 sm:py-1 bg-rose-50 text-rose-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                ¡Diseño exclusivo!
              </span>
            </div>
            
            <div className="h-px bg-stone-100 w-full mb-8 sm:mb-10" />
            
            <p className="text-stone-500 leading-relaxed text-lg sm:text-xl font-light italic">
              "{product.description}"
            </p>
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
              <span>🎁</span>
              <span>¡Ideal para hacer un regalazo!</span>
            </div>
          </div>

          <div className="space-y-8 sm:space-y-12 mb-8 sm:mb-12">
            <div>
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-stone-900">Elegí tu talle y color ✨</h3>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[10px] sm:text-xs text-stone-400 underline hover:text-rose-400 transition-colors flex items-center gap-2"
                >
                  <Ruler size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Guía de talles
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {product.variations.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariation(v)}
                    disabled={v.stock === 0}
                    className={`
                      px-4 sm:px-6 py-4 sm:py-5 rounded-[20px] sm:rounded-[24px] border-2 transition-all text-sm flex flex-col items-center gap-1
                      ${selectedVariation?._id === v._id 
                        ? "border-rose-400 bg-rose-400 text-white shadow-2xl scale-[1.02]" 
                        : "border-stone-100 text-stone-600 hover:border-rose-200 bg-white"}
                      ${v.stock === 0 ? "opacity-30 cursor-not-allowed grayscale bg-stone-50 border-transparent" : ""}
                    `}
                  >
                    <span className="font-bold text-base sm:text-lg">{v.size}</span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-70">{v.color}</span>
                    {v.stock < 5 && v.stock > 0 && (
                      <span className="text-[8px] text-rose-500 font-bold mt-1 uppercase">¡Quedan poquitos!</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariation}
              className={`w-full py-5 sm:py-7 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-2xl ${
                selectedVariation 
                  ? "bg-rose-400 text-white hover:bg-rose-500 shadow-rose-100" 
                  : "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none"
              }`}
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              {selectedVariation ? "¡Lo quiero en mi bolsa!" : "Elegí una opción"}
            </button>
            <p className="text-center text-stone-400 text-xs sm:text-sm italic">
              ☁️ Sumalo ahora y preparate para el mejor descanso.
            </p>
          </div>

          {/* Beneficios sutiles UX */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-stone-100">
            <div className="flex items-center gap-3 sm:gap-4 text-stone-500">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 flex items-center justify-center text-lg sm:text-xl">🧼</div>
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-900">Cuidado</span>
                <span className="text-[9px] sm:text-[10px] text-stone-400 italic">Lavado tranqui</span>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-stone-500">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 flex items-center justify-center text-lg sm:text-xl">🔥</div>
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-900">Estilo</span>
                <span className="text-[9px] sm:text-[10px] text-stone-400 italic">Diseño copado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products - UX Discovery */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 sm:mt-32 pt-20 sm:pt-32 border-t border-stone-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <span className="text-rose-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Más mimos ☁️</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">También te pueden gustar...</h2>
            </div>
            <Link to="/catalog" className="text-stone-400 text-xs sm:text-sm italic underline underline-offset-8 hover:text-rose-400 transition-colors self-start md:self-auto">
              Ver todo el catálogo
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {relatedProducts.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/product/${p._id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] sm:rounded-[40px] bg-stone-50 mb-4 sm:mb-6 shadow-sm group-hover:shadow-xl group-hover:shadow-rose-100 transition-all duration-500">
                    <img 
                      src={p.images[0]} 
                      alt={p.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-rose-500/5 transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif text-stone-900 group-hover:text-rose-400 transition-colors mb-1">{p.title}</h3>
                  <p className="text-stone-400 italic text-sm sm:text-base">${p.price.toLocaleString()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
