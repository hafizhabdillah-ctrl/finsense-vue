<template>
  <form class="py-2 px-4 max-w-2xl" @submit.prevent="onSubmitHandler">
    <h1 class="p-2 text-gray-700 text-2xl font-bold">Tambah Transaksi</h1>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Waktu:</span>
      <input
        type="date"
        v-model="date"
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        required
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Kategori:</span>
      <select
        v-model="category_id"
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        required
      >
        <option value="">Pilih kategori</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Keterangan:</span>
      <input
        type="text"
        placeholder="Masukan keterangan..."
        v-model="description"
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Nominal:</span>
      <input
        type="number"
        placeholder="Masukan nominal..."
        v-model="amount"
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        required
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Tipe:</span>
      <select
        v-model="type"
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
      >
        <option value="income">Masuk</option>
        <option value="expense">Keluar</option>
      </select>
    </div>
    <button
      type="submit"
      :disabled="submitting"
      class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
    >
      {{ submitting ? 'Menyimpan...' : 'Konfirmasi' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTransactions } from '@/composables/useTransactions';
import Swal from 'sweetalert2';

const router = useRouter();
const { addTransaction } = useTransactions();

const date = ref(new Date().toISOString().split('T')[0]);
const category_id = ref('');
const description = ref('');
const amount = ref('');
const type = ref('income');
const submitting = ref(false);

const categories = ref([
  { id: 1, name: 'Penjualan' },
  { id: 2, name: 'Restok' },
  { id: 3, name: 'Operasional' },
  { id: 4, name: 'Gaji Karyawan' },
  { id: 5, name: 'Bayar Hutang' },
  { id: 6, name: 'Hutang Pelanggan' },
]);

const onSubmitHandler = async () => {
  if (!category_id.value || !amount.value) {
    Swal.fire('Perhatian', 'Lengkapi data kategori dan nominal', 'info');
    return;
  }
  submitting.value = true;
  const payload = {
    category_id: parseInt(category_id.value),
    amount: parseFloat(amount.value),
    description: description.value,
    transaction_date: date.value,
    type: type.value,
    source: 'manual',
  };
  const result = await addTransaction(payload);
  submitting.value = false;
  if (result) router.push('/transactions');
};
</script>

