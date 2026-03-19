import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.ts";
import { IProduct } from "../types/index.ts";
import { ShoppingBag, Star, Heart, Truck, ShieldCheck, MessageCircle, ChevronDown, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-500 font-serif italic">Preparando tu momento de relax...</p>
      </div>
    </div>
  );

  return (
    <div className="pb-20 bg-[#FFFCF9]">
      {/* Hero Section - UX Playful & Gifting */}
      <section className="relative h-[80vh] sm:h-[85vh] flex items-center justify-center overflow-hidden bg-[#FFF5F7]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-rose-400 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-6 sm:mb-8 block"
          >
            ¡Encontrá el regalo más copado! 🎁✨
          </motion.span>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif mb-8 sm:mb-10 text-stone-900 leading-[0.9] tracking-tighter">
            Diseños para <br />
            <span className="italic text-rose-300 text-4xl sm:text-6xl md:text-8xl">divertirse</span>
          </h1>
          <p className="text-stone-500 text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 font-light italic max-w-2xl mx-auto leading-relaxed">
            "Buscamos los diseños más locos y divertidos para que estar en casa sea una fiesta. ¡Sorprendé con un regalo que no se van a olvidar!"
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/catalog" className="w-full sm:w-auto bg-rose-400 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-bold hover:bg-rose-500 transition-all shadow-2xl shadow-rose-100 group flex items-center justify-center gap-3">
              Ver diseños copados
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                🔥
              </motion.span>
            </Link>
          </div>
        </motion.div>
        
        {/* Decorative Elements - More Vibrant */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200/40 rounded-full blur-3xl opacity-30" />
      </section>

      {/* Trust Bar - UX Playful & Gifting */}
      <section className="py-16 border-y border-stone-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center gap-6 group">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400 group-hover:bg-rose-400 group-hover:text-white transition-all duration-500">
              <Star size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg">Diseños Únicos</h3>
              <p className="text-stone-400 text-sm italic">Lo que buscás, está acá</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400 group-hover:bg-rose-400 group-hover:text-white transition-all duration-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg">Regalo Seguro</h3>
              <p className="text-stone-400 text-sm italic">¡Les va a encantar!</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400 group-hover:bg-rose-400 group-hover:text-white transition-all duration-500">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg">Regalos con Onda</h3>
              <p className="text-stone-400 text-sm italic">Mimos para sorprender</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid - UX Playful */}
      <section id="productos" className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl font-serif mb-4 sm:mb-6 text-stone-900 tracking-tight">Los más pedidos 🔥</h2>
            <p className="text-stone-400 text-base sm:text-lg italic leading-relaxed">
              Estos son los favoritos de la comunidad MIMARTE. ¡No te quedes sin el tuyo!
            </p>
          </div>
          <div className="text-rose-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] pb-2 border-b border-rose-100 self-start md:self-auto">
            Temporada 2026
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
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
                  
                  {/* Hover Action - More Playful */}
                  <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-rose-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-xl whitespace-nowrap">
                      ¡Lo quiero!
                    </span>
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-900">En stock</span>
                    </div>
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
      </section>

      {/* Testimonials - UX Community & Trust */}
      <section className="bg-rose-50/50 py-20 sm:py-32 rounded-[40px] sm:rounded-[80px] my-10 sm:my-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 sm:mb-20">
            <span className="text-rose-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Comunidad MIMARTE ☁️</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-stone-900">Lo que dicen en casa</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: "Sofi G.", text: "No puedo creer lo suave que es la tela. Me lo pongo y automáticamente me relajo. ¡Amo!", emoji: "💖" },
              { name: "Lucas M.", text: "Compré uno para regalar y terminé comprando otro para mí. La calidad es de otro planeta.", emoji: "🚀" },
              { name: "Valen R.", text: "El envío fue súper rápido y la presentación es un mimo total. ¡Súper recomendados!", emoji: "✨" }
            ].map((review, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-xl shadow-rose-100/20 border border-rose-50 relative"
              >
                <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{review.emoji}</div>
                <p className="text-stone-500 italic mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-bold text-rose-400">
                    {review.name[0]}
                  </div>
                  <span className="text-sm font-bold text-stone-900">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story - UX Emotional Connection & Gifting Focus */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] sm:rounded-[80px] overflow-hidden shadow-2xl shadow-rose-100">
              <img 
                src="https://picsum.photos/seed/mimarte-fun/800/800" 
                alt="Diseños Divertidos" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 bg-white p-6 sm:p-8 rounded-[30px] sm:rounded-[40px] shadow-xl border border-rose-50 hidden sm:block">
              <p className="text-2xl sm:text-4xl font-serif italic text-rose-400">¡Regalá onda!</p>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-2">Diseños que sorprenden</p>
            </div>
          </motion.div>
          
          <div>
            <span className="text-rose-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-4 sm:mb-6 block">¿Por qué MIMARTE? 🎁</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-6 sm:mb-8 text-stone-900 leading-tight">Buscamos lo más <br /><span className="italic text-stone-400">copado para vos</span></h2>
            <div className="space-y-4 sm:space-y-6 text-stone-500 text-base sm:text-lg italic leading-relaxed">
              <p>
                MIMARTE nació de las ganas de encontrar esos diseños que te hacen decir "¡Lo quiero ya!". No somos una fábrica aburrida, somos buscadores de onda.
              </p>
              <p>
                Seleccionamos los pijamas, medias y batas con las temáticas más divertidas porque creemos que estar en casa no tiene por qué ser serio. Si es de tu serie favorita, tiene un dibujo loco o colores vibrantes, ¡lo queremos en nuestra colección!
              </p>
              <p>
                Nuestra misión es que cuando abras un paquete de MIMARTE, sientas que te estás haciendo un regalo increíble (o que vas a quedar como un rey regalándolo).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - UX Clarity & Trust */}
      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-32">
        <div className="text-center mb-12 sm:mb-20">
          <span className="text-rose-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Dudas comunes ☁️</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-900">Preguntas Frecuentes</h2>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {[
            { q: "¿Hacen envíos a todo el país?", a: "¡Obvio! Llegamos a cada rinconcito de Argentina a través de Correo Argentino y Andreani. Tu pijama viaja seguro." },
            { q: "¿Cómo sé cuál es mi talle?", a: "En cada producto tenés un botón de 'Guía de Talles' con las medidas exactas. Si tenés dudas, ¡escribinos por WhatsApp!" },
            { q: "¿Se pueden hacer cambios?", a: "Sí, tenés 30 días para realizar cambios si el talle no te convence. Queremos que estés 100% feliz con tu compra." },
            { q: "¿Qué medios de pago aceptan?", a: "Aceptamos todas las tarjetas de crédito, débito y transferencia bancaria. ¡Súper fácil!" }
          ].map((item, i) => (
            <details key={i} className="group bg-white rounded-[24px] sm:rounded-[32px] border border-stone-100 overflow-hidden transition-all hover:shadow-lg hover:shadow-rose-100/30">
              <summary className="flex items-center justify-between p-6 sm:p-8 cursor-pointer list-none">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 pr-4">{item.q}</h3>
                <span className="text-rose-400 transition-transform group-open:rotate-180 flex-shrink-0">
                  <ChevronDown size={20} className="sm:w-6 sm:h-6" />
                </span>
              </summary>
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-stone-500 italic text-sm sm:text-base leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Giant Catalog CTA - The Heart of Sales */}
      <section className="max-w-7xl mx-auto px-6 py-10 sm:py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-rose-400 rounded-[40px] sm:rounded-[80px] p-10 sm:p-20 md:p-32 text-center relative overflow-hidden shadow-2xl shadow-rose-200"
        >
          <div className="relative z-10">
            <span className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] mb-6 sm:mb-8 block">¿Todavía no sabés qué regalar? 🎁</span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif text-white mb-8 sm:mb-12 leading-tight italic">
              Explorá todo <br /> nuestro catálogo
            </h2>
            <Link 
              to="/catalog" 
              className="inline-flex items-center gap-3 sm:gap-4 bg-white text-rose-400 px-10 sm:px-16 py-5 sm:py-7 rounded-full font-bold text-lg sm:text-2xl hover:scale-105 transition-transform shadow-2xl group"
            >
              <LayoutGrid size={24} className="sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform" />
              ¡Ver todos los diseños! 🔥
            </Link>
          </div>
          
          {/* Decorative floating emojis */}
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-20 left-20 text-6xl opacity-20 hidden lg:block"
          >
            ☁️
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute bottom-20 right-20 text-6xl opacity-20 hidden lg:block"
          >
            🔥
          </motion.div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-300/50 to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* Newsletter - UX Engagement */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="bg-stone-900 rounded-[80px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 italic">Mimos en tu mail</h2>
            <p className="text-stone-400 text-xl mb-12 max-w-xl mx-auto font-light italic">
              "Sumate a nuestra lista y recibí novedades, tips de descanso y algún que otro regalito sorpresa." 🎁
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Tu mail más lindo..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white placeholder:text-stone-600 focus:outline-none focus:border-rose-300 transition-colors italic"
              />
              <button className="bg-rose-400 text-white px-10 py-5 rounded-full font-bold hover:bg-rose-500 transition-all shadow-xl shadow-rose-900/20">
                ¡Me sumo!
              </button>
            </form>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
            <div className="absolute bottom-20 right-20 w-64 h-64 border border-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer - Warm & Close */}
      <footer className="bg-stone-900 text-white py-24 rounded-t-[80px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-serif mb-8 tracking-tighter italic">MIMARTE</h2>
              <p className="text-stone-400 text-lg italic max-w-md leading-relaxed">
                "Gracias por dejarnos ser parte de tus momentos de descanso. Dormir bien es el mejor mimo que te podés dar."
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-stone-500">Escribinos</h4>
              <ul className="space-y-4 text-stone-300">
                <li className="hover:text-rose-300 transition-colors cursor-pointer italic">hola@mimarte.com</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer italic">+54 11 2233-4455</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-stone-500">Comunidad</h4>
              <ul className="space-y-4 text-stone-300">
                <li className="hover:text-rose-300 transition-colors cursor-pointer italic underline underline-offset-8">Instagram</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer italic underline underline-offset-8">TikTok</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            <p>© 2026 MIMARTE • Hecho con mucho amor</p>
            <div className="flex gap-8">
              <span className="cursor-pointer hover:text-white transition-colors">Términos</span>
              <span className="cursor-pointer hover:text-white transition-colors">Privacidad</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
