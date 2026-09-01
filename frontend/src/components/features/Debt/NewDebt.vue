<template>
  <form class="py-2 px-4 max-w-2xl" @submit.prevent="onSubmitHandler">
    <h1 class="p-2 text-gray-700 text-2xl font-bold">
      Tambah Piutang Baru
    </h1>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Nama Orang:</span>
      <input
        type="text"
        placeholder="Masukan nama orang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="customer_name"
        required
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Total Hutang:</span>
      <input
        type="number"
        placeholder="Masukan total hutang..."
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="total_debt"
        required
      />
    </div>
    <div class="px-2 mt-4 relative flex flex-col gap-2">
      <span class="font-bold">Jatuh Tempo:</span>
      <input
        type="date"
        class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        v-model="due_date"
        required
      />
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
import { useDebts } from '@/composables/useDebts';
import Swal from 'sweetalert2';

const router = useRouter();
const { addDebt } = useDebts();

const customer_name = ref('');
const total_debt = ref('');
const due_date = ref('');
const submitting = ref(false);

const onSubmitHandler = async () => {
  if (!customer_name.value || !total_debt.value || !due_date.value) {
    Swal.fire({ title: 'Mohon isi seluruh data', icon: 'info' });
    return;
  }
  submitting.value = true;
  const success = await addDebt({
    customer_name: customer_name.value,
    total_debt: Number(total_debt.value),
    due_date: due_date.value,
  });
  submitting.value = false;
  if (success) router.push('/debts');
};
</script>

