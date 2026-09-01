<template>
  <form class="py-2 px-4 max-w-2xl" @submit.prevent="onSubmitHandler">
    <h1 class="p-2 text-gray-700 text-2xl font-bold">Tambah POS Baru</h1>

    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Nama Barang:</span>
      <select
        v-model="selectedProduct"
        @change="handleProductChange"
        class="w-full p-2 border-2 border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
      >
        <option value="">Pilih Barang dari Stok</option>
        <option v-for="p in products" :key="p.id" :value="p.id">
          {{ p.name }} - Rp {{ p.price?.toLocaleString() }}
        </option>
      </select>
    </div>

    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Jumlah Barang:</span>
      <input
        type="number"
        class="w-full p-2 border-2 border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        placeholder="Masukan jumlah Barang..."
        v-model="qty"
        min="1"
      />
    </div>

    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Harga:</span>
      <input
        type="number"
        class="w-full p-2 border-2 border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        placeholder="Masukan harga barang..."
        v-model="price"
      />
    </div>

    <button
      type="submit"
      class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 hover:border-sky-950 transition-all"
    >
      <span>Konfirmasi</span>
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { getProducts } from '@/services/productService';
import Swal from 'sweetalert2';

const router = useRouter();
const cartStore = useCartStore();

const selectedProduct = ref('');
const price = ref('');
const qty = ref('');
const products = ref([]);

onMounted(async () => {
  try {
    const res = await getProducts();
    products.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
});

const handleProductChange = () => {
  if (selectedProduct.value) {
    const prod = products.value.find((p) => String(p.id) === String(selectedProduct.value));
    if (prod) {
      price.value = prod.price || '';
    }
  } else {
    price.value = '';
  }
};

const onSubmitHandler = () => {
  if (!selectedProduct.value || !price.value || !qty.value) {
    Swal.fire('Perhatian', 'Lengkapi semua data', 'info');
    return;
  }
  const prod = products.value.find((p) => String(p.id) === String(selectedProduct.value));
  if (!prod) {
    Swal.fire('Error', 'Produk tidak ditemukan', 'error');
    return;
  }

  cartStore.addItem({
    id: prod.id,
    name: prod.name,
    price: parseInt(price.value),
    qty: parseInt(qty.value),
  });
  Swal.fire('Sukses', 'Item ditambahkan ke keranjang', 'success');
  router.push('/pos');
};
</script>

