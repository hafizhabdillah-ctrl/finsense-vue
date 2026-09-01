<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat data...</div>
  <form v-else @submit.prevent="onSubmitHandler" class="p-4 max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-800">Edit Hutang</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">ID Hutang: {{ id }}</p>
    <div class="grid grid-cols-2 gap-2 border-t pt-2">
      <p class="flex items-center font-semibold text-gray-600">
        Nama Orang:
      </p>
      <input
        class="p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="customer_name"
        required
      />
      <p class="flex items-center font-semibold text-gray-600">
        Total Hutang:
      </p>
      <input
        type="number"
        class="p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="total_debt"
        required
      />
      <p class="flex items-center font-semibold text-gray-600">
        Jatuh Tempo:
      </p>
      <input
        type="date"
        class="p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="due_date"
        required
      />
      <p class="flex items-center font-semibold text-gray-600">Status:</p>
      <select
        class="p-2 border border-gray-400 rounded bg-white focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="status"
      >
        <option value="pending">Belum Lunas</option>
        <option value="paid">Lunas</option>
        <option value="overdue">Overdue</option>
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
import { useDebts } from '@/composables/useDebts';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const { fetchDebtById, editDebt } = useDebts();

const customer_name = ref('');
const total_debt = ref('');
const due_date = ref('');
const status = ref('');
const loading = ref(true);
const submitting = ref(false);

onMounted(async () => {
  try {
    const data = await fetchDebtById(props.id);
    customer_name.value = data.customer_name;
    total_debt.value = data.total_debt;
    due_date.value = data.due_date ? data.due_date.split('T')[0] : '';
    status.value = data.status;
  } catch (err) {
    router.push('/debts');
  } finally {
    loading.value = false;
  }
});

const onSubmitHandler = async () => {
  submitting.value = true;
  const success = await editDebt(props.id, {
    customer_name: customer_name.value,
    total_debt: Number(total_debt.value),
    due_date: due_date.value,
    status: status.value,
  });
  submitting.value = false;
  if (success) router.push(`/debts/${props.id}`);
};
</script>

