import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // En un entorno real, esto validaría contra el backend.
    // Para este prototipo, usamos una clave simple.
    if (password === "admin123") {
      localStorage.setItem("mimarte_admin", "true");
      navigate("/admin");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-[40px] border border-stone-100 shadow-xl shadow-stone-100 text-center"
      >
        <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Lock size={32} />
        </div>
        <h1 className="text-3xl font-serif mb-2">Acceso Admin</h1>
        <p className="text-stone-400 text-sm mb-10">Ingresa la clave de gestión de MIMARTE</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:border-stone-900 outline-none transition-all text-center"
            required
          />
          <button 
            type="submit"
            className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all"
          >
            Entrar
            <ChevronRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
