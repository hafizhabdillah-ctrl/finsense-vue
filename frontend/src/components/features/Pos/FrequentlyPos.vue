<template>
  <div class="mt-4">
    <p class="text-lg font-semibold px-2 py-2">Produk Sering Dibeli</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2">
      <div
        v-for="product in products"
        :key="product.id"
        @click="handleAdd(product)"
        class="p-4 border rounded-xl cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
      >
        <div class="font-semibold text-gray-800">{{ product.name }}</div>
        <div class="text-sm text-gray-500">
          Stok: {{ product.stock }} {{ product.unit || '' }}
        </div>
        <div class="text-sky-950 font-bold mt-1">
          Rp {{ product.price?.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProducts } from '@/services/productService';
import { useCartStore } from '@/stores/cart';
import Swal from 'sweetalert2';

const products = ref([]);
const cartStore = useCartStore();

onMounted(async () => {
  try {
    const res = await getProducts();
    products.value = (res.data || []).slice(0, 6);
  } catch (err) {
    console.error(err);
  }
});

const handleAdd = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price || 0,
    qty: 1,
  });
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: `${product.name} ditambahkan ke keranjang`,
    timer: 1500,
    showConfirmButton: false,
  });
};
</script>

