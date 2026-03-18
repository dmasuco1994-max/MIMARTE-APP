import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api.ts";
import { IProduct, IVariation } from "../types/index.ts";
import { ChevronLeft, Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<IProduct>>({
    title: "",
    description: "",
    price: 0,
    images: [""],
    variations: [{ size: "", color: "", stock: 0 }]
  });

  useEffect(() => {
    if (id) {
      api.getProduct(id).then(setFormData);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.updateProduct(id, formData);
      } else {
        await api.createProduct(formData);
      }
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [...(formData.variations || []), { size: "", color: "", stock: 0 }]
    });
  };

  const removeVariation = (index: number) => {
    const newVariations = [...(formData.variations || [])];
    newVariations.splice(index, 1);
    setFormData({ ...formData, variations: newVariations });
  };

  const updateVariation = (index: number, field: keyof IVariation, value: any) => {
    const newVariations = [...(formData.variations || [])];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setFormData({ ...formData, variations: newVariations });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...(formData.images || []), ""] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Volver al Panel</span>
      </button>

      <h1 className="text-4xl font-serif mb-12">{id ? "Editar Producto" : "Nuevo Producto"}</h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Información Básica */}
        <section className="bg-white p-8 rounded-[32px] border border-stone-100 space-y-6">
          <h2 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-6">Información General</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Título del Producto</label>
            <input 
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
              placeholder="Ej: Pijama de Stitch Invierno"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Descripción</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all resize-none"
              placeholder="Describe los materiales, el calce y detalles especiales..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Precio ($)</label>
            <input 
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
            />
          </div>
        </section>

        {/* Galería de Imágenes */}
        <section className="bg-white p-8 rounded-[32px] border border-stone-100 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs uppercase tracking-widest font-bold text-stone-400">Galería de Fotos (URLs)</h2>
            <button type="button" onClick={addImage} className="text-stone-900 text-sm font-bold flex items-center gap-1">
              <Plus size={16} /> Añadir URL
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.images?.map((img, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-grow relative">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input 
                    type="url"
                    required
                    value={img}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 outline-none transition-all"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                {index > 0 && (
                  <button type="button" onClick={() => removeImage(index)} className="p-3 text-stone-300 hover:text-red-500">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Variaciones */}
        <section className="bg-white p-8 rounded-[32px] border border-stone-100 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs uppercase tracking-widest font-bold text-stone-400">Variaciones (Talle, Color, Stock)</h2>
            <button type="button" onClick={addVariation} className="text-stone-900 text-sm font-bold flex items-center gap-1">
              <Plus size={16} /> Añadir Variación
            </button>
          </div>

          <div className="space-y-4">
            {formData.variations?.map((v, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-stone-50 rounded-2xl relative">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Talle</label>
                  <input 
                    type="text"
                    required
                    value={v.size}
                    onChange={(e) => updateVariation(index, "size", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 outline-none"
                    placeholder="S, M, L, 40..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Color</label>
                  <input 
                    type="text"
                    required
                    value={v.color}
                    onChange={(e) => updateVariation(index, "color", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 outline-none"
                    placeholder="Azul, Rosa..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Stock</label>
                  <input 
                    type="number"
                    required
                    value={v.stock}
                    onChange={(e) => updateVariation(index, "stock", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 outline-none"
                  />
                </div>
                <div className="flex items-end justify-end">
                  {index > 0 && (
                    <button type="button" onClick={() => removeVariation(index)} className="p-2 text-stone-300 hover:text-red-500">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 text-white py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 disabled:opacity-50"
        >
          <Save size={24} />
          {loading ? "Guardando..." : "Guardar Producto"}
        </button>
      </form>
    </div>
  );
}
