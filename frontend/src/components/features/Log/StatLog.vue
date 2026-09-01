<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        TOTAL TRANSAKSI HARI INI
      </h1>
      <p class="flex items-center gap-2 text-2xl font-bold text-sky-950">
        <span>{{ stats.totalTransactions }}</span>
        <span class="relative text-sm top-1">Transaksi</span>
      </p>
    </div>
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        STOK MASUK HARI INI
      </h1>
      <p class="flex items-center gap-2 text-2xl font-bold text-sky-950">
        <span>{{ stats.stockIn }}</span>
        <span class="relative text-sm top-1">Barang</span>
      </p>
    </div>
    <div class="relative flex-1 flex flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <h1 class="text-gray-500 font-bold text-sm uppercase tracking-wider">
        STOK KELUAR HARI INI
      </h1>
      <p class="flex items-center gap-2 text-2xl font-bold text-sky-950">
        <span>{{ stats.stockOut }}</span>
        <span class="relative text-sm top-1">Barang</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStockLogs } from '@/composables/useStockLogs';

const today = new Date();
const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

const { logs } = useStockLogs({ startDate: startOfDay, endDate: endOfDay });

const stats = computed(() => {
  const totalTransactions = logs.value.length;
  const stockIn = logs.value
    .filter((l) => l.type === 'in')
    .reduce((sum, l) => sum + l.quantity, 0);
  const stockOut = logs.value
    .filter((l) => l.type === 'out')
    .reduce((sum, l) => sum + l.quantity, 0);
  return { totalTransactions, stockIn, stockOut };
});
</script>

