<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat detail...</div>
  <div v-else-if="!log" class="p-6 text-gray-500">Log tidak ditemukan</div>
  <div v-else class="p-4 max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-800">Detail Log</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">ID Log: {{ log.id }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 border-t pt-4 mt-2">
      <p class="font-semibold text-gray-600">Waktu:</p>
      <p>{{ new Date(log.created_at).toLocaleString() }}</p>
      <p class="font-semibold text-gray-600">Nama Produk:</p>
      <p class="font-medium">{{ log.product?.name }}</p>
      <p class="font-semibold text-gray-600">SKU:</p>
      <p>{{ log.product?.sku }}</p>
      <p class="font-semibold text-gray-600">Tipe:</p>
      <p>
        {{
          log.type === 'in'
            ? 'Stok Masuk'
            : log.type === 'out'
            ? 'Stok Keluar'
            : 'Penyesuaian'
        }}
      </p>
      <p class="font-semibold text-gray-600">Jumlah:</p>
      <p class="font-bold">{{ log.quantity }}</p>
      <p class="font-semibold text-gray-600">Oleh:</p>
      <p>{{ log.operator }}</p>
      <p class="font-semibold text-gray-600">Status:</p>
      <p>{{ log.status === 'completed' ? 'Selesai' : 'Menunggu audit' }}</p>
      <p class="font-semibold text-gray-600">Catatan:</p>
      <p>{{ log.note || '-' }}</p>
    </div>
    <div class="flex gap-4 mt-4">
      <button
        @click="router.push(`/logs/edit/${id}`)"
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
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStockLogs } from '@/composables/useStockLogs';
import Swal from 'sweetalert2';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const { logs, removeLog } = useStockLogs();
const log = ref(null);
const loading = ref(true);

const findLog = () => {
  const found = logs.value.find((l) => String(l.id) === String(props.id));
  if (found) {
    log.value = found;
    loading.value = false;
  } else if (logs.value.length > 0) {
    loading.value = false;
  }
};

onMounted(findLog);
watch(logs, findLog);

const onDeleteHandler = async () => {
  const result = await Swal.fire({
    title: 'Hapus Log?',
    text: `Yakin ingin menghapus log ini "${log.value?.product?.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7f1d1d',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  });
  if (result.isConfirmed) {
    const success = await removeLog(props.id);
    if (success) router.push('/logs');
  }
};
</script>

