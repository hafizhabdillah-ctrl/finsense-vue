<template>
  <div v-if="loading" class="p-4 text-gray-500">Memuat data log...</div>
  <div v-else class="overflow-x-auto">
    <div class="min-w-[800px]">
      <div class="bg-sky-950 p-2 flex w-full mt-4 text-white font-semibold">
        <div class="flex-1 text-center">Waktu</div>
        <div class="flex-1 text-center">Produk</div>
        <div class="flex-1 text-center">SKU</div>
        <div class="flex-1 text-center">Tipe</div>
        <div class="flex-1 text-center">Jumlah</div>
        <div class="flex-1 text-center">Oleh</div>
        <div class="flex-1 text-center">Status</div>
      </div>
      <div class="flex flex-col">
        <div v-if="currentItems.length === 0" class="p-4 text-center text-gray-500">
          {{ searchTerm ? 'Tidak ada log yang cocok' : 'Tidak ada data log barang' }}
        </div>
        <template v-else>
          <div
            v-for="log in currentItems"
            :key="log.id"
            @click="router.push(`/logs/${log.id}`)"
            class="flex items-center w-full p-2 border-b border-r border-l border-gray-300 cursor-pointer hover:bg-gray-300 transition-all"
          >
            <div class="flex-1 text-center text-gray-800 text-sm">
              {{ new Date(log.created_at).toLocaleString() }}
            </div>
            <div class="flex-1 text-center text-gray-800 text-sm font-bold">
              {{ log.product?.name }}
            </div>
            <div class="flex-1 text-center text-gray-500 text-sm">
              {{ log.product?.sku }}
            </div>
            <div class="flex-1 text-center text-gray-500 text-sm">
              {{
                log.type === 'in'
                  ? 'Stok Masuk'
                  : log.type === 'out'
                  ? 'Stok Keluar'
                  : 'Penyesuaian'
              }}
            </div>
            <div class="flex-1 text-center text-gray-800 text-sm font-semibold">
              {{ log.quantity }}
            </div>
            <div class="flex-1 text-center text-gray-800 text-sm">
              {{ log.operator }}
            </div>
            <div class="flex-1 text-center text-gray-800 text-sm">
              {{ log.status === 'completed' ? 'Selesai' : 'Menunggu audit' }}
            </div>
          </div>
        </template>
        <div class="p-2 border-t border-gray-200 flex justify-between">
          <p class="text-sm text-gray-500">
            Menampilkan {{ startRange }}-{{ endRange }} dari {{ totalItems }} log
          </p>
          <div class="flex gap-2">
            <button
              @click="goToPrevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 text-sm border rounded-md font-medium',
                currentPage === 1
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'cursor-pointer text-gray-600 border-gray-300 hover:bg-white'
              ]"
            >
              Sebelumnya
            </button>
            <button
              @click="goToNextPage"
              :disabled="indexOfLastItem >= totalItems"
              :class="[
                'px-3 py-1 text-sm border rounded-md font-medium',
                indexOfLastItem >= totalItems
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'cursor-pointer text-gray-600 border-gray-300 hover:bg-white'
              ]"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStockLogs } from '@/composables/useStockLogs';

const props = defineProps({
  searchTerm: { type: String, default: '' },
});

const router = useRouter();
const { logs, loading } = useStockLogs();
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredLogs = computed(() => {
  if (!props.searchTerm.trim()) return logs.value;
  const lowerSearch = props.searchTerm.toLowerCase();
  return logs.value.filter(
    (log) =>
      log.product?.name?.toLowerCase().includes(lowerSearch) ||
      log.product?.sku?.toLowerCase().includes(lowerSearch)
  );
});

const totalItems = computed(() => filteredLogs.value.length);
const indexOfLastItem = computed(() => currentPage.value * itemsPerPage);
const indexOfFirstItem = computed(() => indexOfLastItem.value - itemsPerPage);

const currentItems = computed(() =>
  filteredLogs.value.slice(indexOfFirstItem.value, indexOfLastItem.value)
);

const startRange = computed(() => (totalItems.value === 0 ? 0 : indexOfFirstItem.value + 1));
const endRange = computed(() => Math.min(indexOfLastItem.value, totalItems.value));

const goToNextPage = () => {
  if (indexOfLastItem.value < totalItems.value) currentPage.value++;
};
const goToPrevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

