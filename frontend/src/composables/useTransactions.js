import { ref, onMounted } from 'vue';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/services/transactionService';
import Swal from 'sweetalert2';

export function useTransactions(params = {}) {
  const transactions = ref([]);
  const loading = ref(true);

  const fetchTransactions = async () => {
    loading.value = true;
    try {
      const res = await getTransactions(params);
      transactions.value = res.data || [];
    } catch (err) {
      console.error('Gagal mengambil transaksi:', err);
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (data) => {
    try {
      await createTransaction(data);
      Swal.fire('Berhasil', 'Transaksi berhasil ditambahkan', 'success');
      await fetchTransactions();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menambah transaksi';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const editTransaction = async (id, data) => {
    try {
      await updateTransaction(id, data);
      Swal.fire('Berhasil', 'Transaksi berhasil diperbarui', 'success');
      await fetchTransactions();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal memperbarui transaksi';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      Swal.fire('Berhasil', 'Transaksi berhasil dihapus', 'success');
      await fetchTransactions();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menghapus transaksi';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  onMounted(() => {
    fetchTransactions();
  });

  return {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  };
}
