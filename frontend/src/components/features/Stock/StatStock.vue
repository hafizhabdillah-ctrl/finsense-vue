<template>
  <div v-if="loading" class="flex w-full gap-4 mt-4 text-gray-500">
    Memuat statistik...
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 border-gray-300 gap-4 mt-4">
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        PRODUK AKTIF
      </h1>
      <p class="flex items-center gap-2 text-2xl font-bold text-sky-950">
        <span>{{ totalProducts }}</span>
        <span class="relative text-sm top-1">Barang</span>
      </p>
    </div>
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        PRODUK MENIPIS
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
</script>

