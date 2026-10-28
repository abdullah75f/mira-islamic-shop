export type Product = {
  id: string;
  name: string;
  price: number;
  colors: string[];
  size?: string;
  image: string;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  color: string;
  size?: string;
  image: string;
  quantity: number;
};
