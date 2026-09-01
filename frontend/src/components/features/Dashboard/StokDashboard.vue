<template>
  <div class="space-y-6">
    <div class="bg-white border p-4 rounded border-gray-300 shadow-sm">
      <div class="flex gap-1">
        <h2 class="flex font-bold text-lg mb-2">
          Rekomendasi Restok
        </h2>
        <span class="flex font-semibold items-start text-green-500 text-xs">AI Powered</span>
      </div>
      <p v-if="loading" class="text-gray-500">Memuat prediksi...</p>
      <p v-else-if="restockList.length === 0" class="text-gray-500">
        Semua produk aman, tidak perlu restok.
      </p>
      <ul v-else>
        <li v-for="p in restockList" :key="p.id" class="mb-2 border-b pb-1">
          <span class="font-medium">{{ p.name }}</span> - Stok: {{ p.stock }}
          (min: {{ p.min_stock }})
          <span class="text-sm text-blue-600">
            (Prob. restok: {{ (p.probability * 100).toFixed(0) }}%)
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const restockList = ref([]);
const lowStockList = ref([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    const productsRes = await api.get('/products');
    const products = productsRes.data || [];

    const lowStockProducts = products.filter((p) => p.stock <= p.min_stock);
    lowStockList.value = lowStockProducts;

    const predictions = [];
    for (const product of lowStockProducts.slice(0, 10)) {
      try {
        const aiRes = await api.get(`/ai/predict-stock/${product.id}`);
        if (aiRes.data?.need_restock) {
          predictions.push({
            id: product.id,
            name: product.name,
            stock: product.stock,
            min_stock: product.min_stock,
            probability: aiRes.data.probability,
          });
        }
      } catch (err) {
        console.error(`Prediksi AI gagal untuk ${product.name}`, err);
      }
    }
    restockList.value = predictions;
  } catch (err) {
    console.error('Gagal mengambil data produk', err);
  } finally {
    loading.value = false;
  }
});
</script>

