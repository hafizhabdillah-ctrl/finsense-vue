<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat data...</div>
  <form v-else @submit.prevent="onSubmitHandler" class="p-4 max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-800">Edit Transaksi</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">ID Transaksi: {{ id }}</p>

    <div class="grid grid-cols-2 gap-2 border-t pt-2">
      <p class="flex items-center font-semibold text-gray-600">
        Tanggal:
      </p>
      <input
        type="date"
        v-model="formData.date"
        class="p-2 border border-gray-400 rounded"
        required
      />

      <p class="flex items-center font-semibold text-gray-600">
        Kategori:
      </p>
      <select
        v-model="formData.category_id"
        class="p-2 border border-gray-400 rounded"
        required
      >
        <option value="">Pilih Kategori</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <p class="flex items-center font-semibold text-gray-600">
        Keterangan:
      </p>
      <input
        type="text"
        v-model="formData.description"
        class="p-2 border border-gray-400 rounded"
      />

      <p class="flex items-center font-semibold text-gray-600">
        Nominal:
      </p>
      <input
        type="number"
        v-model="formData.amount"
        class="p-2 border border-gray-400 rounded"
        required
      />

      <p class="flex items-center font-semibold text-gray-600">Tipe:</p>
      <select
        v-model="formData.type"
        class="p-2 border border-gray-400 rounded"
        required
      >
        <option value="income">Masuk</option>
        <option value="expense">Keluar</option>
      </select>
    </div>

    <button
      type="submit"
      :disabled="submitting"
      class="flex items-center gap-2 mt-4 cursor-pointer bg-sky-950 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
    >
      {{ submitting ? 'Menyimpan...' : 'Konfirmasi' }}
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTransactionById, updateTransaction } from '@/services/transactionService';
import Swal from 'sweetalert2';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const loading = ref(true);
const submitting = ref(false);

const formData = ref({
  date: '',
  category_id: '',
  description: '',
  amount: '',
  type: 'income',
});

const categories = ref([
  { id: 1, name: 'Penjualan' },
  { id: 2, name: 'Restok' },
  { id: 3, name: 'Operasional' },
  { id: 4, name: 'Gaji Karyawan' },
  { id: 5, name: 'Bayar Hutang' },
  { id: 6, name: 'Hutang Pelanggan' },
]);

onMounted(async () => {
  try {
    const response = await getTransactionById(props.id);
    const tx = response.data;
    formData.value = {
      date: tx.transaction_date ? tx.transaction_date.split('T')[0] : '',
      category_id: tx.category_id,
      description: tx.description || '',
      amount: tx.amount,
      type: tx.type,
    };
  } catch (err) {
    Swal.fire('Error', 'Gagal memuat data transaksi', 'error');
    router.push('/transactions');
  } finally {
    loading.value = false;
  }
});

const onSubmitHandler = async () => {
  if (!formData.value.category_id || !formData.value.amount || !formData.value.type) {
    Swal.fire('Perhatian', 'Lengkapi semua data', 'info');
    return;
  }
  submitting.value = true;
  try {
    const payload = {
      category_id: parseInt(formData.value.category_id),
      amount: parseFloat(formData.value.amount),
      description: formData.value.description,
      transaction_date: formData.value.date,
      type: formData.value.type,
      source: 'manual',
    };
    await updateTransaction(props.id, payload);
    Swal.fire('Sukses', 'Transaksi berhasil diperbarui', 'success');
    router.push(`/transactions/${props.id}`);
  } catch (err) {
    Swal.fire('Gagal', err.response?.data?.error || 'Gagal memperbarui transaksi', 'error');
  } finally {
    submitting.value = false;
  }
};
</script>

