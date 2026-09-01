<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat data...</div>
  <form v-else @submit.prevent="onSubmitHandler" class="p-4 max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-800">Edit Log</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">ID Log: {{ id }}</p>
    <div class="grid grid-cols-2 gap-4 border-t pt-2">
      <p class="flex items-center font-semibold text-gray-600">Status:</p>
      <select
        class="p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="status"
      >
        <option value="completed">Selesai</option>
        <option value="pending_audit">Menunggu audit</option>
      </select>
      <p class="flex items-center font-semibold text-gray-600">
        Catatan:
      </p>
      <input
        class="p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="note"
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
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStockLogs } from '@/composables/useStockLogs';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const { logs, editLog } = useStockLogs();

const status = ref('');
const note = ref('');
const loading = ref(true);
const submitting = ref(false);

const findAndPopulate = () => {
  const found = logs.value.find((l) => String(l.id) === String(props.id));
  if (found) {
    status.value = found.status;
    note.value = found.note || '';
    loading.value = false;
  } else if (logs.value.length > 0) {
    loading.value = false;
  }
};

onMounted(findAndPopulate);
watch(logs, findAndPopulate);

const onSubmitHandler = async () => {
  submitting.value = true;
  const result = await editLog(props.id, { status: status.value, note: note.value });
  submitting.value = false;
  if (result) router.push(`/logs/${props.id}`);
};
</script>

