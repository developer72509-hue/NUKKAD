import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'nukkad_cart_v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { shopId: null, shopName: null, items: [] };
    return JSON.parse(raw);
  } catch {
    return { shopId: null, shopName: null, items: [] };
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  /**
   * Adds an item held client-side for display only (name/price/image are
   * shown, never trusted at checkout — getShopItemsByIds() re-fetches
   * authoritative values right before placeOrder()).
   */
  function addItem(product, shop, quantity = 1) {
    setCart((prev) => {
      // Cross-shop cart is not silently mixed — starting a new shop clears the old cart.
      if (prev.shopId && prev.shopId !== shop.id) {
        return {
          shopId: shop.id,
          shopName: shop.name,
          items: [{ itemId: product.id, name: product.name, price: product.price, unit: product.unit, imageUrl: product.image_url, quantity }],
        };
      }

      const existing = prev.items.find((i) => i.itemId === product.id);
      const items = existing
        ? prev.items.map((i) =>
            i.itemId === product.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [...prev.items, { itemId: product.id, name: product.name, price: product.price, unit: product.unit, imageUrl: product.image_url, quantity }];

      return { shopId: shop.id, shopName: shop.name, items };
    });
  }

  function updateQuantity(itemId, quantity) {
    setCart((prev) => {
      if (quantity <= 0) {
        const items = prev.items.filter((i) => i.itemId !== itemId);
        return items.length ? { ...prev, items } : { shopId: null, shopName: null, items: [] };
      }
      return {
        ...prev,
        items: prev.items.map((i) => (i.itemId === itemId ? { ...i, quantity } : i)),
      };
    });
  }

  function removeItem(itemId) {
    updateQuantity(itemId, 0);
  }

  function clearCart() {
    setCart({ shopId: null, shopName: null, items: [] });
  }

  function replaceForNewShop(shop, product, quantity) {
    setCart({
      shopId: shop.id,
      shopName: shop.name,
      items: [{ itemId: product.id, name: product.name, price: product.price, unit: product.unit, imageUrl: product.image_url, quantity }],
    });
  }

  const subtotal = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart.items]
  );

  const itemCount = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.quantity, 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({
      shopId: cart.shopId,
      shopName: cart.shopName,
      items: cart.items,
      subtotal,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      replaceForNewShop,
    }),
    [cart, subtotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
