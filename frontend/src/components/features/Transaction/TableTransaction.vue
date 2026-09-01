<template>
  <div v-if="loading" class="p-4 text-gray-500">Memuat transaksi...</div>
  <div v-else class="overflow-x-auto">
    <div class="min-w-[800px]">
      <div class="bg-sky-950 p-2 flex w-full mt-4 text-white font-semibold">
        <div class="flex-1 text-center">No.</div>
        <div class="flex-4 text-center">Tanggal</div>
        <div class="flex-4 text-center">Kategori</div>
        <div class="flex-4 text-center">Keterangan</div>
        <div class="flex-4 text-center">Nominal</div>
        <div class="flex-4 text-center">Tipe</div>
      </div>
      <div class="flex flex-col">
        <div v-if="totalItems === 0" class="p-8 text-center text-gray-500 border-b border-r border-gray-300">
          {{
            startDate || endDate
              ? 'Tidak ada transaksi dalam rentang tanggal tersebut'
              : 'Belum ada catatan transaksi.'
          }}
        </div>
        <template v-else>
          <div
            v-for="(transaction, idx) in currentItems"
            :key="transaction.id"
            @click="router.push(`/transactions/${transaction.id}`)"
            class="flex items-center w-full p-2 border-b border-r border-l border-gray-300 cursor-pointer hover:bg-gray-300 transition-all"
          >
            <div class="flex-1 text-center text-gray-800 text-sm">
              {{ indexOfFirstItem + idx + 1 }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm">
              {{ new Date(transaction.transaction_date).toLocaleDateString('id-ID') }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm font-medium">
              {{ transaction.category?.name || '-' }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm">
              {{ transaction.description || '-' }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm font-semibold">
              Rp {{ transaction.amount?.toLocaleString() }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-bold uppercase',
                  transaction.type === 'income' ? 'text-green-700' : 'text-red-700'
                ]"
              >
                {{ transaction.type === 'income' ? 'Masuk' : 'Keluar' }}
              </span>
            </div>
          </div>
        </template>
        <div class="p-2 border-t border-gray-200 flex justify-between">
          <p class="text-sm text-gray-500">
            Menampilkan {{ startRange }}-{{ endRange }} dari {{ totalItems }} transaksi
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
import { useTransactions } from '@/composables/useTransactions';

const props = defineProps({
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
});

const router = useRouter();
const { transactions, loading } = useTransactions();
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredTransactions = computed(() => {
  if (!props.startDate && !props.endDate) return transactions.value;

  return transactions.value.filter((transaction) => {
    const txDate = transaction.transaction_date.split('T')[0];
    if (props.startDate && props.endDate) {
      return txDate >= props.startDate && txDate <= props.endDate;
    } else if (props.startDate) {
      return txDate >= props.startDate;
    } else if (props.endDate) {
      return txDate <= props.endDate;
    }
    return true;
  });
});

const totalItems = computed(() => filteredTransactions.value.length);
const indexOfLastItem = computed(() => currentPage.value * itemsPerPage);
const indexOfFirstItem = computed(() => indexOfLastItem.value - itemsPerPage);

const currentItems = computed(() =>
  filteredTransactions.value.slice(indexOfFirstItem.value, indexOfLastItem.value)
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

