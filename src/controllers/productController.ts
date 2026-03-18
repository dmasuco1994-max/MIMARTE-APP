import fs from "fs/promises";
import path from "path";
import { IProduct } from "../types/index.ts";

const DATA_FILE = path.join(process.cwd(), "data.json");

// Inicializar archivo si no existe
const initFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
};

const readData = async (): Promise<IProduct[]> => {
  await initFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

const writeData = async (data: IProduct[]) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

export const getProducts = async (req: any, res: any) => {
  try {
    const products = await readData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

export const getProductById = async (req: any, res: any) => {
  try {
    const products = await readData();
    const product = products.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

export const createProduct = async (req: any, res: any) => {
  try {
    const products = await readData();
    const newProduct = {
      ...req.body,
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    await writeData(products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error al crear producto", error });
  }
};

export const updateProduct = async (req: any, res: any) => {
  try {
    const products = await readData();
    const index = products.findIndex(p => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Producto no encontrado" });
    
    products[index] = { ...products[index], ...req.body };
    await writeData(products);
    res.json(products[index]);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar producto", error });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  try {
    const products = await readData();
    const filtered = products.filter(p => p._id !== req.params.id);
    await writeData(filtered);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};
