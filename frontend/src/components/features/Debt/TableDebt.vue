<template>
  <div v-if="loading" class="p-4 text-center text-gray-500">
    Memuat daftar hutang...
  </div>
  <div v-else-if="filteredDebts.length === 0" class="p-4 text-center text-gray-500">
    {{ searchTerm ? 'Tidak ada hutang yang cocok' : 'Belum ada data hutang' }}
  </div>
  <div v-else class="overflow-x-auto shadow-md rounded-lg">
    <table class="min-w-full bg-white border border-gray-200">
      <thead class="bg-sky-950 text-white">
        <tr>
          <th class="px-4 py-3 text-center text-sm font-semibold">No</th>
          <th class="px-4 py-3 text-center text-sm font-semibold">
            Nama Pelanggan
          </th>
          <th class="px-4 py-3 text-right text-sm font-semibold">
            Total Hutang
          </th>
          <th class="px-4 py-3 text-right text-sm font-semibold">
            Sudah Dibayar
          </th>
          <th class="px-4 py-3 text-right text-sm font-semibold">
            Sisa Hutang
          </th>
          <th class="px-4 py-3 text-center text-sm font-semibold">
            Jatuh Tempo
          </th>
          <th class="px-4 py-3 text-center text-sm font-semibold">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(debt, idx) in currentItems"
          :key="debt.id"
          @click="router.push(`/debts/${debt.id}`)"
          class="border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-all"
        >
          <td class="px-4 py-3 text-center text-sm text-gray-700">
            {{ indexOfFirstItem + idx + 1 }}
          </td>
          <td class="px-4 py-3 text-center text-sm font-medium text-gray-900">
            {{ debt.customer_name }}
          </td>
          <td class="px-4 py-3 text-right text-sm text-gray-500 line-through">
            Rp {{ debt.total_debt?.toLocaleString('id-ID') }}
          </td>
          <td class="px-4 py-3 text-right text-sm text-gray-600">
            Rp {{ debt.paid_amount?.toLocaleString('id-ID') }}
          </td>
          <td class="px-4 py-3 text-right text-sm font-bold text-red-700">
            Rp {{ (debt.total_debt - debt.paid_amount)?.toLocaleString('id-ID') }}
          </td>
          <td class="px-4 py-3 text-center text-sm text-gray-700">
            {{ new Date(debt.due_date).toLocaleDateString('id-ID') }}
          </td>
          <td class="px-4 py-3 text-center">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(debt.status).className]">
              {{ getStatusBadge(debt.status).label }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="totalPages > 1" class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-500">
        Menampilkan {{ startRange }}-{{ endRange }} dari {{ totalItems }} hutang
      </p>
      <div class="flex gap-2 items-center">
        <button
          @click="goToPrevPage"
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 text-sm border rounded-md font-medium transition-all',
            currentPage === 1
              ? 'text-gray-300 border-gray-200 cursor-not-allowed'
              : 'text-gray-600 border-gray-300 hover:bg-white cursor-pointer'
          ]"
        >
          Sebelumnya
        </button>
        <span class="px-3 py-1 text-sm text-gray-700">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-1 text-sm border rounded-md font-medium transition-all',
            currentPage === totalPages
              ? 'text-gray-300 border-gray-200 cursor-not-allowed'
              : 'text-gray-600 border-gray-300 hover:bg-white cursor-pointer'
          ]"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDebts } from '@/composables/useDebts';

const props = defineProps({
  searchTerm: { type: String, default: '' },
});

const router = useRouter();
const { debts, loading } = useDebts();
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredDebts = computed(() => {
  if (!props.searchTerm.trim()) return debts.value;
  const lowerSearch = props.searchTerm.toLowerCase();
  return debts.value.filter((debt) =>
    debt.customer_name?.toLowerCase().includes(lowerSearch)
  );
});

const totalItems = computed(() => filteredDebts.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
const indexOfLastItem = computed(() => currentPage.value * itemsPerPage);
const indexOfFirstItem = computed(() => indexOfLastItem.value - itemsPerPage);

const currentItems = computed(() =>
  filteredDebts.value.slice(indexOfFirstItem.value, indexOfLastItem.value)
);

const startRange = computed(() => (totalItems.value === 0 ? 0 : indexOfFirstItem.value + 1));
const endRange = computed(() => Math.min(indexOfLastItem.value, totalItems.value));

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const goToPrevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const getStatusBadge = (status) => {
  const statusMap = {
    pending: { label: 'Belum Lunas', className: 'bg-yellow-100 text-yellow-800' },
    partial: { label: 'Sebagian Lunas', className: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Lunas', className: 'bg-green-100 text-green-800' },
    overdue: { label: 'Jatuh Tempo', className: 'bg-red-100 text-red-800' },
  };
  return statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
};
</script>

