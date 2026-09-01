<template>
  <div class="w-full bg-white p-4 border border-gray-300 rounded shadow-sm">
    <h2 class="flex flex-row gap-1 font-bold text-lg mb-2">
      <span>Prediksi Produk Terlaris Hari Ini</span>
      <span class="flex font-semibold items-start text-green-500 text-xs">
        AI Powered
      </span>
    </h2>

    <div v-if="loading" class="text-center py-4 text-gray-500">
      Memuat data prediksi...
    </div>
    <div v-else-if="topProducts.length === 0" class="text-center py-4 text-gray-400">
      Belum ada data produk terlaris hari ini.
    </div>
    <ul v-else>
      <li
        v-for="p in topProducts"
        :key="p.product"
        class="flex justify-between py-1 border-b border-gray-300"
      >
        <span>{{ p.product }}</span>
        <span
          :class="p.is_top_seller ? 'text-green-600 font-bold' : 'text-gray-400'"
        >
          {{ p.is_top_seller ? '✅ Top' : '❌' }} ({{ Math.round(p.probability * 100) }}%)
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const topProducts = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    const res = await api.get('/ai/real-top-products');
    const products = Array.isArray(res.data?.top_products)
      ? res.data.top_products
      : [];
    topProducts.value = products;
  } catch (err) {
    console.error(err);
    topProducts.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

