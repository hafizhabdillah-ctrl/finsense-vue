<template>
  <div v-if="loading" class="p-4 text-gray-500">Memuat data stok...</div>
  <div v-else class="overflow-x-auto">
    <div class="min-w-[800px]">
      <div class="bg-sky-950 p-2 flex w-full mt-4 text-white font-semibold">
        <div class="flex-1 text-center">No.</div>
        <div class="flex-4 text-center">Nama Produk</div>
        <div class="flex-4 text-center">SKU</div>
        <div class="flex-2 text-center">Stok</div>
        <div class="flex-4 text-center">Status</div>
      </div>
      <div class="flex flex-col">
        <div v-if="currentItems.length === 0" class="p-4 text-center text-gray-500">
          {{ searchTerm ? 'Tidak ada produk yang cocok' : 'Tidak ada data stok barang' }}
        </div>
        <template v-else>
          <div
            v-for="(product, idx) in currentItems"
            :key="product.id"
            @click="router.push(`/stocks/${product.id}`)"
            class="flex items-center w-full p-2 border-b border-r border-l border-gray-300 cursor-pointer hover:bg-gray-300 transition-all"
          >
            <div class="flex-1 text-center text-gray-800 text-sm">
              {{ indexOfFirstItem + idx + 1 }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm font-medium">
              {{ product.name }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm">
              {{ product.sku }}
            </div>
            <div class="flex-2 text-center text-gray-800 text-sm">
              {{ product.stock }}
            </div>
            <div class="flex-4 text-center text-gray-800 text-sm">
              <span
                :class="[
                  'font-bold',
                  product.stock <= product.min_stock ? 'text-red-700' : 'text-green-700'
                ]"
              >
                {{ product.stock <= product.min_stock ? 'Menipis' : 'Aman' }}
              </span>
            </div>
          </div>
        </template>
        <div class="p-2 border-t border-gray-200 flex justify-between">
          <p class="text-sm text-gray-500">
            Menampilkan {{ startRange }}-{{ endRange }} dari {{ totalItems }} produk
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
import { useProducts } from '@/composables/useProducts';

const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const { products, loading } = useProducts();

const currentPage = ref(1);
const itemsPerPage = 5;

const filteredProducts = computed(() => {
  if (!props.searchTerm.trim()) return products.value;
  const lowerSearch = props.searchTerm.toLowerCase();
  return products.value.filter(
    (product) =>
      product.name?.toLowerCase().includes(lowerSearch) ||
      product.sku?.toLowerCase().includes(lowerSearch),
  );
});

const totalItems = computed(() => filteredProducts.value.length);
const indexOfLastItem = computed(() => currentPage.value * itemsPerPage);
const indexOfFirstItem = computed(() => indexOfLastItem.value - itemsPerPage);

const currentItems = computed(() =>
  filteredProducts.value.slice(indexOfFirstItem.value, indexOfLastItem.value)
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

