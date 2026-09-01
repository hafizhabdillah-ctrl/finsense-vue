import { ref, onMounted } from 'vue';
import {
  getDebts,
  getDebtById,
  createDebt,
  updateDebt,
  deleteDebt,
  payDebt,
} from '@/services/debtService';
import Swal from 'sweetalert2';

export function useDebts() {
  const debts = ref([]);
  const loading = ref(true);

  const fetchDebts = async () => {
    loading.value = true;
    try {
      const res = await getDebts();
      debts.value = res.data || [];
    } catch (err) {
      console.error('Gagal mengambil hutang:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchDebtById = async (id) => {
    try {
      const res = await getDebtById(id);
      return res.data;
    } catch (err) {
      Swal.fire('Error', 'Gagal memuat detail hutang', 'error');
      throw err;
    }
  };

  const addDebt = async (data) => {
    try {
      await createDebt(data);
      Swal.fire('Berhasil', 'Hutang berhasil ditambahkan', 'success');
      await fetchDebts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menambah hutang';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const editDebt = async (id, data) => {
    try {
      await updateDebt(id, data);
      Swal.fire('Berhasil', 'Hutang berhasil diperbarui', 'success');
      await fetchDebts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal memperbarui hutang';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const removeDebt = async (id) => {
    try {
      await deleteDebt(id);
      Swal.fire('Berhasil', 'Hutang berhasil dihapus', 'success');
      await fetchDebts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menghapus hutang';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const addPayment = async (id, data) => {
    try {
      await payDebt(id, data);
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal mencatat pembayaran';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  onMounted(() => {
    fetchDebts();
  });

  return {
    debts,
    loading,
    fetchDebts,
    fetchDebtById,
    addDebt,
    editDebt,
    removeDebt,
    addPayment,
  };
}
