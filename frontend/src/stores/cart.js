import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCart, saveCart, addToCart, removeFromCart, updateCartQty, clearCart } from '@/utils/cart';

export const useCartStore = defineStore('cart', () => {
  const cart = ref(getCart());

  const subtotal = computed(() =>
    cart.value.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const addItem = (item) => {
    cart.value = addToCart(item);
  };

  const removeItem = (id) => {
    cart.value = removeFromCart(id);
  };

  const updateItem = (id, qty) => {
    cart.value = updateCartQty(id, qty);
  };

  const emptyCart = () => {
    clearCart();
    cart.value = [];
  };

  return {
    cart,
    subtotal,
    addItem,
    removeItem,
    updateItem,
    emptyCart,
  };
});
