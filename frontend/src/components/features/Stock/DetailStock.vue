<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat detail...</div>
  <div v-else-if="!product" class="p-6 text-gray-500">Produk tidak ditemukan</div>
  <div v-else>
    <h1 class="text-2xl font-bold text-gray-800">Detail Produk</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">ID Produk: {{ product.id }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 border-t pt-4 mt-2">
      <p class="font-semibold text-gray-600">Nama Produk:</p>
      <p>{{ product.name }}</p>
      <p class="font-semibold text-gray-600">SKU:</p>
      <p>{{ product.sku }}</p>
      <p class="font-semibold text-gray-600">Jumlah Stok:</p>
      <p>{{ product.stock }} {{ product.unit || '' }}</p>
      <p class="font-semibold text-gray-600">Minimal Stok:</p>
      <p>{{ product.min_stock }}</p>
      <p class="font-semibold text-gray-600">Status:</p>
      <span
        :class="[
          'font-bold',
          product.stock <= product.min_stock ? 'text-red-600' : 'text-green-600'
        ]"
      >
        {{ product.stock <= product.min_stock ? 'Menipis' : 'Aman' }}
      </span>
    </div>
    <div class="flex flex-wrap gap-4 mt-4">
      <button
        @click="router.push(`/stocks/edit/${id}`)"
        class="flex items-center gap-2 cursor-pointer bg-sky-950 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all"
      >
        Edit
      </button>
      <button
        @click="onAdjustStock('in')"
        class="flex items-center gap-2 cursor-pointer bg-green-700 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-green-700 transition-all"
      >
        Tambah Stok
      </button>
      <button
        @click="onAdjustStock('out')"
        class="flex items-center gap-2 cursor-pointer bg-yellow-600 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-yellow-600 transition-all"
      >
        Kurangi Stok
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
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from '@/composables/useProducts';
import Swal from 'sweetalert2';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const { products, loading, removeProduct, adjustStock } = useProducts();
const product = ref(null);

const findProduct = () => {
  if (products.value.length > 0) {
    product.value = products.value.find((p) => p.id === props.id) || null;
  }
};

watch(products, findProduct, { immediate: true });

const onDeleteHandler = async () => {
  const result = await Swal.fire({
    title: 'Hapus Produk?',
    text: `Yakin ingin menghapus "${product.value?.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7f1d1d',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  });
  if (result.isConfirmed) {
    const success = await removeProduct(props.id);
    if (success) router.push('/stocks');
  }
};

const onAdjustStock = async (type) => {
  const { value: quantity } = await Swal.fire({
    title: type === 'in' ? 'Tambah Stok' : 'Kurangi Stok',
    input: 'number',
    inputLabel: 'Jumlah',
    inputPlaceholder: 'Masukkan jumlah',
    showCancelButton: true,
  });
  if (quantity && quantity > 0) {
    await adjustStock(props.id, quantity, type);
  }
};
</script>

