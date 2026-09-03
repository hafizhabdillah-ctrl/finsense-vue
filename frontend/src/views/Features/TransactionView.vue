<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <h1 class="text-2xl font-bold">Catatan keuangan</h1>
        <p class="text-gray-500 text-sm mt-1">{{ todayLabel }}</p>
      </div>
      <button
        @click="router.push({ path: '/new', query: { type: 'transaction' } })"
        class="flex items-center gap-2 bg-sky-950 p-2 px-4 text-white rounded-lg font-semibold border hover:bg-white hover:text-sky-950 transition cursor-pointer"
      >
        <PlusCircle :size="16" /> Tambah Transaksi
      </button>
    </div>
    <StatTransaction />

    <!-- Filter Tanggal -->
    <div class="flex flex-wrap items-center gap-4 mt-4 px-2">
      <div class="flex items-center gap-2">
        <Calendar class="text-gray-500" :size="18" />
        <span class="font-medium text-gray-700">Filter Tanggal:</span>
      </div>
      <div class="flex flex-wrap gap-2 items-center">
        <input
          type="date"
          v-model="startDate"
          class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Mulai"
        />
        <span class="text-gray-500">s/d</span>
        <input
          type="date"
          v-model="endDate"
          class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Selesai"
        />
        <button
          @click="handleReset"
          class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>

    <div class="overflow-x-auto mt-2">
      <TableTransaction :startDate="startDate" :endDate="endDate" />
    </div>
    <div class="mt-4">
      <hr />
    </div>
    <h1 class="p-2 text-2xl font-bold mt-2">Ringkasan Keuangan</h1>
    <SummaryTransaction />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StatTransaction from '@/components/features/Transaction/StatTransaction.vue';
import TableTransaction from '@/components/features/Transaction/TableTransaction.vue';
import SummaryTransaction from '@/components/features/Transaction/SummaryTransaction.vue';
import { PlusCircle, Calendar } from 'lucide-vue-next';

const router = useRouter();
const startDate = ref('');
const endDate = ref('');
const todayLabel = new Date().toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const handleReset = () => {
  startDate.value = '';
  endDate.value = '';
};
</script>

