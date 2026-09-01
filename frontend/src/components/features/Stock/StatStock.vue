<template>
  <div v-if="loading" class="flex w-full gap-4 mt-4 text-gray-500">
    Memuat statistik...
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-3 border-gray-300 gap-4 mt-4">
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        TOTAL BARANG AKTIF
      </h1>
      <p class="flex items-center gap-2 text-2xl font-bold text-sky-950">
        <span>{{ totalProducts }}</span>
        <span class="relative text-sm top-1">Barang</span>
      </p>
    </div>
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        PREDIKSI RESTOCK
      </h1>
      <p class="flex items-center gap-2 text-2xl font-bold text-sky-950">
        <span>{{ needRestock }}</span>
        <span class="relative text-sm top-1">Barang</span>
      </p>
    </div>
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        STOK MENIPIS
      </h1>
      <p class="flex items-center gap-2 text-2xl font-bold text-sky-950">
        <span>{{ lowStock }}</span>
        <span class="relative text-sm top-1">Barang</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProducts } from '@/composables/useProducts';

const { products, loading } = useProducts();

const totalProducts = computed(() => products.value.length);
const lowStock = computed(() => products.value.filter((p) => p.stock <= p.min_stock).length);
const needRestock = computed(() => lowStock.value);
</script>

