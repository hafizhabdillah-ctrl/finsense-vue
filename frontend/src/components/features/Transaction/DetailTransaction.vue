<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat detail...</div>
  <div v-else-if="!transaction" class="p-6 text-gray-500">Transaksi tidak ditemukan</div>
  <div v-else class="p-4 max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-800">Detail Transaksi</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">
      ID Transaksi: {{ transaction.id }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-2">
      <p class="font-semibold text-gray-600">Tanggal:</p>
      <p>{{ new Date(transaction.transaction_date).toLocaleDateString('id-ID') }}</p>
      <p class="font-semibold text-gray-600">Kategori:</p>
      <p>{{ transaction.category?.name || '-' }}</p>
      <p class="font-semibold text-gray-600">Keterangan:</p>
      <p>{{ transaction.description || '-' }}</p>
      <p class="font-semibold text-gray-600">Nominal:</p>
      <p>Rp {{ transaction.amount?.toLocaleString() }}</p>
      <p class="font-semibold text-gray-600">Tipe:</p>
      <p :class="transaction.type === 'income' ? 'text-green-700 font-bold' : 'text-red-700 font-bold'">
        {{ transaction.type === 'income' ? 'Masuk' : 'Keluar' }}
      </p>
    </div>
    <div class="flex gap-4 mt-4">
      <button
        @click="router.push(`/transactions/edit/${id}`)"
        class="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all"
      >
        Edit
      </button>
      <button
        @click="onDeleteHandler"
        class="flex items-center gap-2 cursor-pointer bg-red-900 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-red-900 transition-all"
      >
        Hapus
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTransactionById } from '@/services/transactionService';
import { useTransactions } from '@/composables/useTransactions';
import Swal from 'sweetalert2';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const { removeTransaction } = useTransactions();
const transaction = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await getTransactionById(props.id);
    transaction.value = response.data;
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Gagal memuat detail transaksi', 'error');
    router.push('/transactions');
  } finally {
    loading.value = false;
  }
});

const onDeleteHandler = async () => {
  const result = await Swal.fire({
    title: 'Hapus Transaksi?',
    text: 'Yakin ingin menghapus transaksi ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7f1d1d',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  });
  if (result.isConfirmed) {
    const success = await removeTransaction(props.id);
    if (success) router.push('/transactions');
  }
};
</script>

