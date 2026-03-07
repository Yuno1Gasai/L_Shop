export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  phone: string;
  password?: string;
  cart: CartItem[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}
