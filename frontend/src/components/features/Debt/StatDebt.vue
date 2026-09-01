<template>
  <div v-if="loading" class="p-4 text-gray-500">Memuat total hutang...</div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-1 gap-4">
    <div class="flex w-full sm:w-1/4 flex-col justify-between bg-white p-4 border rounded-md border-gray-300 shadow-sm">
      <p class="text-md text-gray-500 font-semibold mb-2">
        TOTAL PIUTANG AKTIF
      </p>
      <p class="text-sky-950 font-bold text-2xl">
        Rp. {{ total.toLocaleString('id-ID') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDebts } from '@/composables/useDebts';

const { debts, loading } = useDebts();

const total = computed(() =>
  debts.value
    .filter(
      (item) =>
        item.status === 'pending' ||
        item.status === 'overdue' ||
        item.status === 'partial'
    )
    .reduce(
      (acc, item) => acc + (item.total_debt - (item.paid_amount || 0)),
      0
    )
);
</script>

