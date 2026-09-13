<template>
  <!-- Rekomendasi Restok: daftar produk yang stoknya menipis (stok <= stok minimum) -->
  <div class="h-full bg-white p-4 border border-gray-300 rounded-md shadow-sm">
    <h2 class="font-bold text-lg mb-2">Rekomendasi Restok</h2>
    <p v-if="loading" class="text-gray-500">Memuat data stok...</p>
    <p v-else-if="lowStockList.length === 0" class="text-gray-500">
      Semua produk aman, tidak perlu restok.
    </p>
    <ul v-else>
      <li
        v-for="p in lowStockList"
        :key="p.id"
        class="mb-2 border-b border-gray-300 pb-1 text-sm"
      >
        <span class="font-medium">{{ p.name }}</span> - Stok: {{ p.stock }}
        (min: {{ p.min_stock }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const lowStockList = ref([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    const productsRes = await api.get('/products');
    const products = productsRes.data || [];
    lowStockList.value = products.filter((p) => p.stock <= p.min_stock);
  } catch (err) {
    console.error('Gagal mengambil data produk', err);
    lowStockList.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
