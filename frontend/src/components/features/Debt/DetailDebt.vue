<template>
  <div v-if="loading" class="p-6 text-gray-500">Memuat detail...</div>
  <div v-else-if="!debt" class="p-6 text-gray-500">Hutang tidak ditemukan</div>
  <div v-else class="p-4 max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-800">Detail Hutang</h1>
    <p class="mb-2 mt-2 text-sm text-gray-500">ID Hutang: {{ debt.id }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 border-t pt-4 mt-2">
      <p class="font-semibold text-gray-600">Nama Orang:</p>
      <p>{{ debt.customer_name }}</p>
      <p class="font-semibold text-gray-600">Total Hutang:</p>
      <p>Rp {{ debt.total_debt?.toLocaleString() }}</p>
      <p class="font-semibold text-gray-600">Telah Dibayar:</p>
      <p>Rp {{ debt.paid_amount?.toLocaleString() }}</p>
      <p class="font-semibold text-gray-600">Sisa Hutang:</p>
      <p :class="remainingDebt > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">
        Rp {{ remainingDebt.toLocaleString() }}
      </p>
      <p class="font-semibold text-gray-600">Jatuh Tempo:</p>
      <p>{{ new Date(debt.due_date).toLocaleDateString('id-ID') }}</p>
      <p class="font-semibold text-gray-600">Status:</p>
      <p class="font-medium">
        {{
          debt.status === 'pending'
            ? 'Belum Lunas'
            : debt.status === 'partial'
            ? 'Sebagian Lunas'
            : debt.status === 'paid'
            ? 'Lunas'
            : 'Jatuh Tempo'
        }}
      </p>
    </div>

    <!-- Tombol aksi -->
    <div class="flex gap-4 mt-4 flex-wrap">
      <button
        @click="router.push(`/debts/edit/${id}`)"
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
      <button
        v-if="debt.status !== 'paid'"
        @click="showPaymentModal = true"
        class="flex items-center gap-2 cursor-pointer bg-green-700 p-2 px-4 text-white font-semibold border rounded-lg hover:bg-white hover:text-green-700 transition-all"
      >
        Bayar Hutang
      </button>
    </div>

    <!-- Riwayat Pembayaran -->
    <div v-if="debt.payments && debt.payments.length > 0" class="mt-6 border-t pt-4">
      <h2 class="text-xl font-semibold text-gray-700 mb-3">
        Riwayat Pembayaran
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold">
                Tanggal
              </th>
              <th class="px-4 py-2 text-left text-sm font-semibold">
                Jumlah
              </th>
              <th class="px-4 py-2 text-left text-sm font-semibold">
                Catatan
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in debt.payments" :key="payment.id" class="border-t">
              <td class="px-4 py-2 text-sm">
                {{ new Date(payment.paid_at).toLocaleDateString('id-ID') }}
              </td>
              <td class="px-4 py-2 text-sm font-medium">
                Rp {{ payment.amount?.toLocaleString() }}
              </td>
              <td class="px-4 py-2 text-sm">{{ payment.note || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Pembayaran -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">Catat Pembayaran</h2>
        <p class="mb-2 text-sm text-gray-600">
          Sisa hutang: <strong>Rp {{ remainingDebt.toLocaleString() }}</strong>
        </p>
        <form @submit.prevent="handlePaymentSubmit">
          <div class="mb-4">
            <label class="block text-sm font-semibold mb-1">
              Jumlah Bayar (Rp)
            </label>
            <input
              type="number"
              v-model="paymentAmount"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-950"
              placeholder="Masukkan jumlah"
              required
              min="1"
              :max="remainingDebt"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              v-model="paymentNote"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-950"
              rows="2"
              placeholder="Contoh: Pembayaran tunai"
            ></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showPaymentModal = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50 cursor-pointer"
            >
              {{ submitting ? 'Menyimpan...' : 'Bayar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDebts } from '@/composables/useDebts';
import Swal from 'sweetalert2';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const { fetchDebtById, removeDebt, addPayment } = useDebts();
const debt = ref(null);
const loading = ref(true);

const showPaymentModal = ref(false);
const paymentAmount = ref('');
const paymentNote = ref('');
const submitting = ref(false);

const remainingDebt = computed(() => {
  if (!debt.value) return 0;
  return debt.value.total_debt - debt.value.paid_amount;
});

onMounted(async () => {
  try {
    debt.value = await fetchDebtById(props.id);
  } catch (err) {
    router.push('/debts');
  } finally {
    loading.value = false;
  }
});

const onDeleteHandler = async () => {
  const result = await Swal.fire({
    title: 'Hapus Hutang?',
    text: `Yakin ingin menghapus hutang "${debt.value?.customer_name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7f1d1d',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  });
  if (result.isConfirmed) {
    const success = await removeDebt(props.id);
    if (success) router.push('/debts');
  }
};

const handlePaymentSubmit = async () => {
  const amount = parseFloat(paymentAmount.value);
  if (isNaN(amount) || amount <= 0) {
    Swal.fire('Error', 'Jumlah harus lebih dari 0', 'error');
    return;
  }
  if (amount > remainingDebt.value) {
    Swal.fire(
      'Error',
      `Pembayaran melebihi sisa hutang (Rp ${remainingDebt.value.toLocaleString()})`,
      'error'
    );
    return;
  }

  submitting.value = true;
  const result = await addPayment(props.id, { amount, note: paymentNote.value });
  submitting.value = false;

  if (result) {
    Swal.fire('Sukses', 'Pembayaran berhasil dicatat', 'success');
    showPaymentModal.value = false;
    paymentAmount.value = '';
    paymentNote.value = '';
    debt.value = await fetchDebtById(props.id);
  }
};
</script>

