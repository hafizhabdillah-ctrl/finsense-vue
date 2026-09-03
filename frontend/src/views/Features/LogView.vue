<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold">Log Barang</h1>
        <p class="text-gray-500 text-sm mt-1">{{ todayLabel }}</p>
      </div>
      <button
        @click="router.push({ path: '/new', query: { type: 'log' } })"
        class="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all"
      >
        <PlusCircle :size="16" />
        <span>Tambah Log baru</span>
      </button>
    </div>
    <StatLog />

    <!-- Search Bar -->
    <div class="relative mt-4 max-w-md">
      <input
        type="text"
        placeholder="Cari berdasarkan nama produk atau SKU..."
        v-model="searchTerm"
        class="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
      />
      <Search class="absolute left-3 top-3 text-gray-400" :size="18" />
    </div>

    <div class="overflow-x-auto mt-2">
      <TableLog :searchTerm="searchTerm" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StatLog from '@/components/features/Log/StatLog.vue';
import TableLog from '@/components/features/Log/TableLog.vue';
import { PlusCircle, Search } from 'lucide-vue-next';

const router = useRouter();
const searchTerm = ref('');
const todayLabel = new Date().toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
</script>

