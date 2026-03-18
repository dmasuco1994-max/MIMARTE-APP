import React from "react";
import { useCartStore } from "../store/cartStore.ts";
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "5491122334455"; // Reemplazar con el número real de MIMARTE
    let message = "¡Hola MIMARTE! 👋 Quiero realizar el siguiente pedido:\n\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   - Talle: ${item.selectedVariation.size}\n`;
      message += `   - Color: ${item.selectedVariation.color}\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio: $${(item.price * item.quantity).toLocaleString()}\n\n`;
    });

    message += `*Total del pedido: $${total.toLocaleString()}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-50/30 rounded-[40px] sm:rounded-[60px] p-8 sm:p-16 border-2 border-dashed border-rose-100"
        >
          <div className="flex justify-center mb-6 sm:mb-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[32px] sm:rounded-[40px] flex items-center justify-center text-rose-200 text-4xl sm:text-5xl shadow-xl shadow-rose-100/50">
              ☁️
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif mb-4 sm:mb-6 text-stone-900 tracking-tight italic">Tu bolsa está esperando...</h2>
          <p className="text-stone-500 mb-8 sm:mb-12 text-lg sm:text-xl font-light italic max-w-md mx-auto leading-relaxed">
            "Parece que todavía no elegiste tu compañero de descanso ideal. <br className="hidden sm:block" />
            ¡Date una vuelta por la colección y encontrá el tuyo!"
          </p>
          <Link to="/catalog" className="inline-flex items-center gap-3 bg-rose-400 text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full font-bold hover:bg-rose-500 transition-all shadow-2xl shadow-rose-100 mx-auto text-sm sm:text-base">
            <LayoutGrid size={20} />
            Ver diseños copados ✨
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-3 sm:mb-4 text-stone-900 tracking-tight italic">Mi bolsa de relax</h1>
          <p className="text-stone-400 text-base sm:text-lg italic">Estás a un paso de tu mejor descanso ☁️</p>
        </div>
        <div className="text-rose-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] border-b border-rose-100 pb-2 self-start md:self-auto">
          {items.length} {items.length === 1 ? 'Mimo' : 'Mimos'} seleccionados
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-20">
        {/* Lista de Productos - UX Informal */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
          {/* Free Shipping Progress - UX Incentive */}
          <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-stone-50 shadow-sm mb-8 sm:mb-12">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <span className="text-base sm:text-lg font-serif italic text-stone-900">
                {total >= 50000 ? "¡Tenés envío gratis! 🚚✨" : `Te faltan $${(50000 - total).toLocaleString()} para el envío gratis`}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-400">Meta: $50.000</span>
            </div>
            <div className="h-3 sm:h-4 bg-stone-50 rounded-full overflow-hidden p-0.5 sm:p-1 border border-stone-100">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((total / 50000) * 100, 100)}%` }}
                className="h-full bg-rose-400 rounded-full shadow-lg shadow-rose-100"
              />
            </div>
          </div>

          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={`${item._id}-${item.selectedVariation._id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] border border-stone-50 hover:border-rose-100 transition-all group bg-white hover:shadow-2xl hover:shadow-rose-100/30"
              >
                <div className="w-full sm:w-32 aspect-[3/4] sm:aspect-square bg-rose-50 rounded-[24px] sm:rounded-[32px] overflow-hidden flex-shrink-0 shadow-inner">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between py-1 sm:py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl sm:text-2xl font-serif text-stone-900 group-hover:text-rose-400 transition-colors">{item.title}</h3>
                      <button 
                        onClick={() => removeItem(item._id, item.selectedVariation._id)}
                        className="p-2 text-stone-200 hover:text-rose-400 transition-colors"
                        title="Quitar producto"
                      >
                        <Trash2 size={18} className="sm:w-[22px] sm:h-[22px]" />
                      </button>
                    </div>
                    
                    <p className="text-stone-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-4 sm:mb-6">
                      Talle {item.selectedVariation.size} • {item.selectedVariation.color}
                    </p>
                  </div>

                  <div className="flex justify-between items-center sm:items-end">
                    <div className="flex items-center gap-4 sm:gap-6 bg-stone-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-stone-100">
                      <button 
                        onClick={() => updateQuantity(item._id, item.selectedVariation._id, item.quantity - 1)}
                        className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-stone-400 hover:text-rose-400 transition-colors"
                      >
                        <Minus size={14} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                      <span className="w-4 sm:w-6 text-center font-bold text-stone-900 text-base sm:text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.selectedVariation._id, item.quantity + 1)}
                        className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-stone-400 hover:text-rose-400 transition-colors"
                      >
                        <Plus size={14} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </div>
                    <p className="text-2xl sm:text-3xl font-serif text-stone-900">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Resumen de Compra - UX Trust Informal */}
        <div className="lg:col-span-1">
          <div className="bg-[#FFF5F7] p-8 sm:p-12 rounded-[40px] sm:rounded-[60px] sticky top-32 shadow-2xl shadow-rose-100/50 border border-rose-50">
            <h2 className="text-2xl sm:text-3xl font-serif mb-8 sm:mb-10 text-stone-900">Resumen</h2>
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="flex justify-between text-stone-500 font-light italic text-sm sm:text-base">
                <span>Subtotal</span>
                <span className="font-medium">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-500 font-light italic text-sm sm:text-base">
                <span>Envío</span>
                <span className="text-rose-400 font-bold">¡Gratis! ✨</span>
              </div>
              <div className="h-px bg-rose-100 my-4 sm:my-6" />
              <div className="flex justify-between items-end">
                <span className="text-lg sm:text-xl text-stone-900">Total</span>
                <span className="text-4xl sm:text-5xl font-serif text-stone-900">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-rose-400 text-white py-5 sm:py-7 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center gap-3 sm:gap-4 hover:bg-rose-500 transition-all shadow-2xl shadow-rose-100 mb-6 sm:mb-8"
            >
              <MessageCircle size={24} className="sm:w-[28px] sm:h-[28px]" />
              Pedir por WhatsApp 📱
            </button>
            
            <div className="space-y-4 sm:space-y-6">
              <p className="text-[9px] sm:text-[10px] text-stone-400 text-center uppercase tracking-[0.2em] leading-relaxed font-bold">
                Al hacer clic, te llevamos a WhatsApp para coordinar el pago y el envío. ¡Es súper fácil!
              </p>
              <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 opacity-30 grayscale contrast-125">
                <span className="text-[9px] sm:text-[10px] font-bold">VISA</span>
                <span className="text-[9px] sm:text-[10px] font-bold">MASTER</span>
                <span className="text-[9px] sm:text-[10px] font-bold">MPAGO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
