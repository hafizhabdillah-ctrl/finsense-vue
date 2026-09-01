<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <h1 class="text-xl md:text-2xl font-bold">Manajemen Stok</h1>
      <button
        @click="router.push('/stocks/new')"
        class="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all"
      >
        <PlusCircle :size="16" />
        <span>Tambah Stok baru</span>
      </button>
    </div>
    <StatStock />

    <!-- Search Bar -->
    <div class="relative mt-4 max-w-md">
      <input
        type="text"
        placeholder="Cari berdasarkan nama atau SKU..."
        v-model="searchTerm"
        class="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
      />
      <Search class="absolute left-3 top-3 text-gray-400" :size="18" />
    </div>

    <div class="overflow-x-auto mt-2">
      <TableStock :searchTerm="searchTerm" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StatStock from '@/components/features/Stock/StatStock.vue';
import TableStock from '@/components/features/Stock/TableStock.vue';
import { PlusCircle, Search } from 'lucide-vue-next';

const router = useRouter();
const searchTerm = ref('');
</script>

