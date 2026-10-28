"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  updateQuantity: (
    productId: string,
    color: string,
    quantity: number,
  ) => void;
  removeItem: (productId: string, color: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mira-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  function addItem(item: Omit<CartItem, "quantity">, quantity: number) {
    setItems((prev) => {
      const existing = prev.find(
        (p) => p.productId === item.productId && p.color === item.color,
      );
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId && p.color === item.color
            ? { ...p, quantity: p.quantity + quantity }
            : p,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }

  function updateQuantity(
    productId: string,
    color: string,
    quantity: number,
  ) {
    if (quantity < 1) {
      removeItem(productId, color);
      return;
    }
    setItems((prev) =>
      prev.map((p) =>
        p.productId === productId && p.color === color
          ? { ...p, quantity }
          : p,
      ),
    );
  }

  function removeItem(productId: string, color: string) {
    setItems((prev) =>
      prev.filter((p) => !(p.productId === productId && p.color === color)),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
