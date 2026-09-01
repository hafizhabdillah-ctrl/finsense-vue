<template>
  <form class="py-2 px-4 max-w-2xl" @submit.prevent="onSubmitHandler">
    <h1 class="p-2 text-gray-700 text-2xl font-bold">Tambah Stok Baru</h1>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Nama Barang:</span>
      <input
        type="text"
        placeholder="Masukan nama barang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg"
        v-model="name"
        required
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">SKU Barang:</span>
      <input
        type="text"
        placeholder="Masukan SKU..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg"
        v-model="sku"
        required
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Jumlah Stok:</span>
      <input
        type="number"
        placeholder="Masukan jumlah barang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg"
        v-model="stock"
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Satuan (opsional):</span>
      <input
        type="text"
        placeholder="Masukan satuan barang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg"
        v-model="unit"
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Harga (opsional):</span>
      <input
        type="number"
        placeholder="Masukan harga barang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg"
        v-model="price"
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Minimal Stok (default 10):</span>
      <input
        type="number"
        placeholder="Masukan jumlah minimal barang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg"
        v-model="min_stock"
      />
    </div>
    <button
      type="submit"
      :disabled="submitting"
      class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
    >
      {{ submitting ? 'Menyimpan...' : 'Tambah Barang' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '@/composables/useProducts';
import Swal from 'sweetalert2';

const router = useRouter();
const { addProduct } = useProducts();

const name = ref('');
const sku = ref('');
const stock = ref('');
const unit = ref('');
const price = ref('');
const min_stock = ref('');
const submitting = ref(false);

const onSubmitHandler = async () => {
  if (!name.value || !sku.value) {
    Swal.fire({
      title: 'Mohon isi seluruh data',
      icon: 'info',
    });
    return;
  }
  submitting.value = true;
  const productData = {
    name: name.value,
    sku: sku.value,
    stock: stock.value ? parseInt(stock.value) : 0,
    unit: unit.value || null,
    price: price.value ? parseFloat(price.value) : null,
    min_stock: min_stock.value ? parseInt(min_stock.value) : 10,
  };
  const result = await addProduct(productData);
  submitting.value = false;
  if (result) router.push('/stocks');
};
</script>

