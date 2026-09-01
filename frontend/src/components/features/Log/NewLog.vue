<template>
  <form class="py-2 px-4 max-w-2xl" @submit.prevent="onSubmitHandler">
    <h1 class="p-2 text-gray-700 text-2xl font-bold">
      Tambah Log Barang
    </h1>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Produk:</span>
      <select
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="product_id"
        required
      >
        <option value="">Pilih produk</option>
        <option v-for="p in products" :key="p.id" :value="p.id">
          {{ p.name }} (SKU: {{ p.sku }})
        </option>
      </select>
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Tipe:</span>
      <select
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="type"
      >
        <option value="in">Stok Masuk</option>
        <option value="out">Stok Keluar</option>
        <option value="adjust">Penyesuaian Manual</option>
      </select>
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Jumlah:</span>
      <input
        type="number"
        placeholder="Masukan jumlah barang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="quantity"
        required
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Catatan (opsional):</span>
      <input
        type="text"
        placeholder="Masukan catatan barang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="note"
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Oleh:</span>
      <select
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="operator"
      >
        <option>Admin</option>
        <option>Kasir</option>
        <option>Gudang</option>
      </select>
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Status:</span>
      <select
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="status"
      >
        <option value="completed">Selesai</option>
        <option value="pending_audit">Menunggu audit</option>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStockLogs } from '@/composables/useStockLogs';
import { getProducts } from '@/services/productService';
import Swal from 'sweetalert2';

const router = useRouter();
const { addLog } = useStockLogs();
const products = ref([]);
const product_id = ref('');
const type = ref('in');
const quantity = ref('');
const note = ref('');
const operator = ref('Admin');
const status = ref('completed');
const submitting = ref(false);

onMounted(async () => {
  try {
    const res = await getProducts();
    products.value = res.data || [];
  } catch (err) {
    Swal.fire('Error', 'Gagal memuat daftar produk', 'error');
  }
});

const onSubmitHandler = async () => {
  if (!product_id.value || !quantity.value) {
    Swal.fire('Perhatian', 'Pilih produk dan isi jumlah', 'info');
    return;
  }
  submitting.value = true;
  const logData = {
    product_id: product_id.value,
    type: type.value,
    quantity: parseInt(quantity.value),
    note: note.value || null,
    operator: operator.value,
    status: status.value,
  };
  const result = await addLog(logData);
  submitting.value = false;
  if (result) router.push('/logs');
};
</script>

