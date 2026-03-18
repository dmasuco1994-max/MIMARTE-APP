import mongoose, { Schema, Document } from "mongoose";

export interface IVariation {
  size: string;
  color: string;
  stock: number;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  variations: IVariation[];
  createdAt: Date;
}

const VariationSchema = new Schema<IVariation>({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  variations: [VariationSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
