<template>
  <div class="p-2">
    <!-- Tab strip -->
    <div class="flex flex-wrap gap-2 border-b border-gray-300 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="type = tab.value"
        :class="[
          'py-2 px-4 font-semibold border-b-2 transition-all cursor-pointer -mb-px',
          type === tab.value
            ? 'border-sky-950 text-sky-950'
            : 'border-transparent text-gray-500 hover:text-sky-950',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Produk -->
    <form v-if="type === 'product'" class="max-w-2xl" @submit.prevent="onSubmitProduct">
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Nama Barang:</span>
        <input
          type="text"
          placeholder="Masukan nama barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg"
          v-model="productForm.name"
          required
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">SKU Barang:</span>
        <input
          type="text"
          placeholder="Masukan SKU..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg"
          v-model="productForm.sku"
          required
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Jumlah Stok:</span>
        <input
          type="number"
          placeholder="Masukan jumlah barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg"
          v-model="productForm.stock"
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Satuan (opsional):</span>
        <input
          type="text"
          placeholder="Masukan satuan barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg"
          v-model="productForm.unit"
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Harga (opsional):</span>
        <input
          type="number"
          placeholder="Masukan harga barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg"
          v-model="productForm.price"
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Minimal Stok (default 10):</span>
        <input
          type="number"
          placeholder="Masukan jumlah minimal barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg"
          v-model="productForm.min_stock"
        />
      </div>
      <button
        type="submit"
        :disabled="submittingProduct"
        class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
      >
        {{ submittingProduct ? 'Menyimpan...' : 'Tambah Barang' }}
      </button>
    </form>

    <!-- Transaksi -->
    <form v-else-if="type === 'transaction'" class="max-w-2xl" @submit.prevent="onSubmitTransaction">
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Waktu:</span>
        <input
          type="date"
          v-model="transactionForm.date"
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          required
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Kategori:</span>
        <select
          v-model="transactionForm.category_id"
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          required
        >
          <option value="">Pilih kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Keterangan:</span>
        <input
          type="text"
          placeholder="Masukan keterangan..."
          v-model="transactionForm.description"
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Nominal:</span>
        <input
          type="number"
          placeholder="Masukan nominal..."
          v-model="transactionForm.amount"
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          required
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Tipe:</span>
        <select
          v-model="transactionForm.type"
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
        >
          <option value="income">Masuk</option>
          <option value="expense">Keluar</option>
        </select>
      </div>
      <button
        type="submit"
        :disabled="submittingTransaction"
        class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
      >
        {{ submittingTransaction ? 'Menyimpan...' : 'Konfirmasi' }}
      </button>
    </form>

    <!-- POS -->
    <form v-else-if="type === 'pos'" class="max-w-2xl" @submit.prevent="onSubmitPos">
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Nama Barang:</span>
        <select
          v-model="posForm.product_id"
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          required
        >
          <option value="">Pilih Barang dari Stok</option>
          <option v-for="p in products" :key="p.id" :value="p.id">
            {{ p.name }} - Rp {{ p.price?.toLocaleString() }}
          </option>
        </select>
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Jumlah Barang:</span>
        <input
          type="number"
          placeholder="Masukan jumlah barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="posForm.qty"
          min="1"
          required
        />
      </div>
      <button
        type="submit"
        :disabled="submittingPos"
        class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
      >
        {{ submittingPos ? 'Menyimpan...' : 'Konfirmasi' }}
      </button>
    </form>

    <!-- Hutang -->
    <form v-else-if="type === 'debt'" class="max-w-2xl" @submit.prevent="onSubmitDebt">
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Nama Orang:</span>
        <input
          type="text"
          placeholder="Masukan nama orang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="debtForm.customer_name"
          required
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Total Hutang:</span>
        <input
          type="number"
          placeholder="Masukan total hutang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="debtForm.total_debt"
          required
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Jatuh Tempo:</span>
        <input
          type="date"
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="debtForm.due_date"
          required
        />
      </div>
      <button
        type="submit"
        :disabled="submittingDebt"
        class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
      >
        {{ submittingDebt ? 'Menyimpan...' : 'Konfirmasi' }}
      </button>
    </form>

    <!-- Log Stok -->
    <form v-else-if="type === 'log'" class="max-w-2xl" @submit.prevent="onSubmitLog">
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Produk:</span>
        <select
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="logForm.product_id"
          required
        >
          <option value="">Pilih produk</option>
          <option v-for="p in products" :key="p.id" :value="p.id">
            {{ p.name }} (SKU: {{ p.sku }})
          </option>
        </select>
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Tipe:</span>
        <select
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="logForm.type"
        >
          <option value="in">Stok Masuk</option>
          <option value="out">Stok Keluar</option>
          <option value="adjust">Penyesuaian Manual</option>
        </select>
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Jumlah:</span>
        <input
          type="number"
          placeholder="Masukan jumlah barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="logForm.quantity"
          required
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Catatan (opsional):</span>
        <input
          type="text"
          placeholder="Masukan catatan barang..."
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="logForm.note"
        />
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Oleh:</span>
        <select
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="logForm.operator"
        >
          <option>Admin</option>
          <option>Kasir</option>
          <option>Gudang</option>
        </select>
      </div>
      <div class="px-2 mt-4 relative flex flex-col gap-2">
        <span class="font-bold">Status:</span>
        <select
          class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
          v-model="logForm.status"
        >
          <option value="completed">Selesai</option>
          <option value="pending_audit">Menunggu audit</option>
        </select>
      </div>
      <button
        type="submit"
        :disabled="submittingLog"
        class="flex items-center py-2 px-4 mx-2 mt-4 gap-2 cursor-pointer bg-sky-950 text-white font-semibold border rounded-lg hover:bg-white hover:text-sky-950 transition-all disabled:opacity-50"
      >
        {{ submittingLog ? 'Menyimpan...' : 'Konfirmasi' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';

import { useProducts } from '@/composables/useProducts';
import { useTransactions } from '@/composables/useTransactions';
import { useDebts } from '@/composables/useDebts';
import { useStockLogs } from '@/composables/useStockLogs';
import { getProducts } from '@/services/productService';

const router = useRouter();
const route = useRoute();

const tabs = [
  { value: 'product', label: 'Produk' },
  { value: 'transaction', label: 'Transaksi' },
  { value: 'pos', label: 'POS' },
  { value: 'debt', label: 'Hutang' },
  { value: 'log', label: 'Log Stok' },
];

const allowedTypes = tabs.map((t) => t.value);
const initialType = allowedTypes.includes(route.query.type) ? route.query.type : 'product';
const type = ref(initialType);

// Shared products list (used by POS + Log tabs)
const products = ref([]);
onMounted(async () => {
  try {
    const res = await getProducts();
    products.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
});

const categories = ref([
  { id: 1, name: 'Penjualan' },
  { id: 2, name: 'Restok' },
  { id: 3, name: 'Operasional' },
  { id: 4, name: 'Gaji Karyawan' },
  { id: 5, name: 'Bayar Hutang' },
  { id: 6, name: 'Hutang Pelanggan' },
]);

// ---------------- Produk ----------------
const { addProduct } = useProducts();
const submittingProduct = ref(false);
const productForm = reactive({
  name: '',
  sku: '',
  stock: '',
  unit: '',
  price: '',
  min_stock: '',
});

const onSubmitProduct = async () => {
  if (!productForm.name || !productForm.sku) {
    Swal.fire({ title: 'Mohon isi seluruh data', icon: 'info' });
    return;
  }
  submittingProduct.value = true;
  const productData = {
    name: productForm.name,
    sku: productForm.sku,
    stock: productForm.stock ? parseInt(productForm.stock) : 0,
    unit: productForm.unit || null,
    price: productForm.price ? parseFloat(productForm.price) : null,
    min_stock: productForm.min_stock ? parseInt(productForm.min_stock) : 10,
  };
  const result = await addProduct(productData);
  submittingProduct.value = false;
  if (result) router.push('/stocks');
};

// ---------------- Transaksi ----------------
const { addTransaction } = useTransactions();
const submittingTransaction = ref(false);
const transactionForm = reactive({
  date: new Date().toISOString().split('T')[0],
  category_id: '',
  description: '',
  amount: '',
  type: 'income',
});

const onSubmitTransaction = async () => {
  if (!transactionForm.category_id || !transactionForm.amount) {
    Swal.fire('Perhatian', 'Lengkapi data kategori dan nominal', 'info');
    return;
  }
  submittingTransaction.value = true;
  const payload = {
    category_id: parseInt(transactionForm.category_id),
    amount: parseFloat(transactionForm.amount),
    description: transactionForm.description,
    transaction_date: transactionForm.date,
    type: transactionForm.type,
    source: 'manual',
  };
  const result = await addTransaction(payload);
  submittingTransaction.value = false;
  if (result) router.push('/transactions');
};

// ---------------- POS ----------------
const { addLog } = useStockLogs();
const submittingPos = ref(false);
const posForm = reactive({
  product_id: '',
  qty: '',
});

const onSubmitPos = async () => {
  if (!posForm.product_id || !posForm.qty) {
    Swal.fire('Perhatian', 'Lengkapi semua data', 'info');
    return;
  }
  const product = products.value.find((p) => String(p.id) === String(posForm.product_id));
  if (!product) {
    Swal.fire('Error', 'Produk tidak ditemukan', 'error');
    return;
  }
  const qty = parseInt(posForm.qty);

  submittingPos.value = true;
  try {
    // 1. Record stock movement (out)
    const logResult = await addLog({
      product_id: posForm.product_id,
      type: 'out',
      quantity: qty,
      note: 'Penjualan POS',
      operator: 'Kasir',
      status: 'completed',
    });
    if (!logResult) {
      submittingPos.value = false;
      return;
    }

    // 2. Record the income transaction
    const incomeCategory = categories.value.find((c) => c.type === 'income') || categories.value[0];
    const payload = {
      category_id: incomeCategory ? incomeCategory.id : undefined,
      amount: (product.price || 0) * qty,
      description: `Penjualan POS: ${product.name} x${qty}`,
      transaction_date: new Date().toISOString(),
      type: 'income',
      source: 'pos',
    };
    const result = await addTransaction(payload);
    if (result) router.push('/pos');
  } catch (err) {
    Swal.fire('Gagal', err.response?.data?.error || 'Terjadi kesalahan', 'error');
  } finally {
    submittingPos.value = false;
  }
};

// ---------------- Hutang ----------------
const { addDebt } = useDebts();
const submittingDebt = ref(false);
const debtForm = reactive({
  customer_name: '',
  total_debt: '',
  due_date: '',
});

const onSubmitDebt = async () => {
  if (!debtForm.customer_name || !debtForm.total_debt || !debtForm.due_date) {
    Swal.fire({ title: 'Mohon isi seluruh data', icon: 'info' });
    return;
  }
  submittingDebt.value = true;
  const success = await addDebt({
    customer_name: debtForm.customer_name,
    total_debt: Number(debtForm.total_debt),
    due_date: debtForm.due_date,
  });
  submittingDebt.value = false;
  if (success) router.push('/debts');
};

// ---------------- Log Stok ----------------
const submittingLog = ref(false);
const logForm = reactive({
  product_id: '',
  type: 'in',
  quantity: '',
  note: '',
  operator: 'Admin',
  status: 'completed',
});

const onSubmitLog = async () => {
  if (!logForm.product_id || !logForm.quantity) {
    Swal.fire('Perhatian', 'Pilih produk dan isi jumlah', 'info');
    return;
  }
  submittingLog.value = true;
  const logData = {
    product_id: logForm.product_id,
    type: logForm.type,
    quantity: parseInt(logForm.quantity),
    note: logForm.note || null,
    operator: logForm.operator,
    status: logForm.status,
  };
  const result = await addLog(logData);
  submittingLog.value = false;
  if (result) router.push('/logs');
};
</script>
