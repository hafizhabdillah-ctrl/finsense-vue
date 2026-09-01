import { ref, onMounted } from 'vue';
import {
  getStockLogs,
  createStockLog,
  updateStockLog,
  deleteStockLog,
} from '@/services/stockLogService';
import Swal from 'sweetalert2';

export function useStockLogs(params = {}) {
  const logs = ref([]);
  const loading = ref(true);

  const fetchLogs = async () => {
    loading.value = true;
    try {
      const res = await getStockLogs(params);
      logs.value = res.data || [];
    } catch (err) {
      console.error('Gagal mengambil log barang:', err);
    } finally {
      loading.value = false;
    }
  };

  const addLog = async (data) => {
    try {
      await createStockLog(data);
      Swal.fire('Berhasil', 'Log barang berhasil ditambahkan', 'success');
      await fetchLogs();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menambah log';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const editLog = async (id, data) => {
    try {
      await updateStockLog(id, data);
      Swal.fire('Berhasil', 'Log barang berhasil diperbarui', 'success');
      await fetchLogs();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal memperbarui log';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const removeLog = async (id) => {
    try {
      await deleteStockLog(id);
      Swal.fire('Berhasil', 'Log barang berhasil dihapus', 'success');
      await fetchLogs();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menghapus log';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  onMounted(() => {
    fetchLogs();
  });

  return {
    logs,
    loading,
    fetchLogs,
    addLog,
    editLog,
    removeLog,
  };
}
