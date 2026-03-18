export interface IVariation {
  _id?: string;
  size: string;
  color: string;
  stock: number;
}

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  variations: IVariation[];
  createdAt: string;
}

export interface ICartItem extends IProduct {
  selectedVariation: IVariation;
  quantity: number;
}
