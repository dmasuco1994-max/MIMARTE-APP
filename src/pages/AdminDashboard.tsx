import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.ts";
import { IProduct } from "../types/index.ts";
import { Plus, Edit, Trash2, Package, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboard() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    api.getProducts().then(setProducts).finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await api.deleteProduct(id);
      loadProducts();
    }
  };

  if (loading) return <div className="p-12 text-center">Cargando panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif mb-2">Panel de Gestión</h1>
          <p className="text-stone-500">Administra el inventario de MIMARTE</p>
        </div>
        <Link 
          to="/admin/new" 
          className="bg-stone-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-[32px] border border-stone-100 overflow-hidden shadow-sm">
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
            {products.map((product) => {
              const totalStock = product.variations.reduce((acc, v) => acc + v.stock, 0);
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
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="font-medium text-stone-900">{product.title}</div>
                        <div className="text-xs text-stone-400 truncate max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-serif text-lg">${product.price.toLocaleString()}</td>
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
                      {product.variations.map((v, i) => (
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
        {products.length === 0 && (
          <div className="py-20 text-center text-stone-400">
            No hay productos registrados. Comienza creando uno nuevo.
          </div>
        )}
      </div>
    </div>
  );
}
