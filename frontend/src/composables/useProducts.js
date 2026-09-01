import { ref, onMounted } from 'vue';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} from '@/services/productService';
import Swal from 'sweetalert2';

export function useProducts() {
  const products = ref([]);
  const loading = ref(true);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      const res = await getProducts();
      products.value = res.data || [];
    } catch (err) {
      console.error('Gagal mengambil produk:', err);
    } finally {
      loading.value = false;
    }
  };

  const addProduct = async (data) => {
    try {
      await createProduct(data);
      Swal.fire('Berhasil', 'Produk berhasil ditambahkan', 'success');
      await fetchProducts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menambah produk';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const editProduct = async (id, data) => {
    try {
      await updateProduct(id, data);
      Swal.fire('Berhasil', 'Produk berhasil diperbarui', 'success');
      await fetchProducts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal memperbarui produk';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      Swal.fire('Berhasil', 'Produk berhasil dihapus', 'success');
      await fetchProducts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menghapus produk';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  const adjustStock = async (id, quantity, type) => {
    try {
      await updateStock(id, { quantity: parseInt(quantity), type });
      Swal.fire('Berhasil', 'Stok berhasil diperbarui', 'success');
      await fetchProducts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal memperbarui stok';
      Swal.fire('Gagal', msg, 'error');
      return false;
    }
  };

  onMounted(() => {
    fetchProducts();
  });

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    adjustStock,
  };
}
