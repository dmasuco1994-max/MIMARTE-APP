import { IProduct } from "../types/index.ts";

const API_URL = "/api/products";

export const api = {
  getProducts: async (): Promise<IProduct[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
  },
  getProduct: async (id: string): Promise<IProduct> => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Error fetching product");
    return res.json();
  },
  createProduct: async (product: Partial<IProduct>): Promise<IProduct> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  updateProduct: async (id: string, product: Partial<IProduct>): Promise<IProduct> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  deleteProduct: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};
