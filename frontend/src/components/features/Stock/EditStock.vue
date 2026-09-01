<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat data...</div>
  <form v-else @submit.prevent="onSubmitHandler" class="p-4 max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-800">Edit Produk</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">ID Produk: {{ id }}</p>
    <div class="grid grid-cols-2 gap-2 border-t pt-2">
      <p class="flex items-center font-semibold text-gray-600">
        Nama Produk:
      </p>
      <input
        class="p-2 border border-gray-400 rounded"
        v-model="name"
        required
      />
      <p class="flex items-center font-semibold text-gray-600">SKU:</p>
      <input
        class="p-2 border border-gray-400 rounded"
        v-model="sku"
        required
      />
      <p class="flex items-center font-semibold text-gray-600">Satuan:</p>
      <input
        class="p-2 border border-gray-400 rounded"
        v-model="unit"
      />
      <p class="flex items-center font-semibold text-gray-600">Harga:</p>
      <input
        type="number"
        class="p-2 border border-gray-400 rounded"
        v-model="price"
      />
      <p class="flex items-center font-semibold text-gray-600">
        Minimal Stok:
      </p>
      <input
        type="number"
        class="p-2 border border-gray-400 rounded"
        v-model="min_stock"
      />
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '@/composables/useProducts';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const { products, loading, editProduct } = useProducts();

const name = ref('');
const sku = ref('');
const unit = ref('');
const price = ref('');
const min_stock = ref(10);
const submitting = ref(false);

const loadProductData = () => {
  const p = products.value.find((item) => item.id === props.id);
  if (p) {
    name.value = p.name || '';
    sku.value = p.sku || '';
    unit.value = p.unit || '';
    price.value = p.price || '';
    min_stock.value = p.min_stock ?? 10;
  }
};

watch(products, loadProductData, { immediate: true });

const onSubmitHandler = async () => {
  submitting.value = true;
  const data = {
    name: name.value,
    sku: sku.value,
    unit: unit.value || null,
    price: price.value ? parseFloat(price.value) : null,
    min_stock: parseInt(min_stock.value),
  };
  const result = await editProduct(props.id, data);
  submitting.value = false;
  if (result) router.push(`/stocks/${props.id}`);
};
</script>

