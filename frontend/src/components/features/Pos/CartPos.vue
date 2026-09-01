<template>
  <div class="flex flex-col p-2 h-full">
    <h1 class="font-semibold text-xl text-sky-950 mb-2">Keranjang</h1>
    <div class="flex flex-col gap-2 max-h-96 overflow-y-auto flex-1 mt-2">
      <p v-if="cartStore.cart.length === 0" class="text-gray-500 text-center py-8">
        Keranjang kosong
      </p>
      <template v-else>
        <div
          v-for="item in cartStore.cart"
          :key="item.id"
          class="border-b pb-2"
        >
          <div class="flex justify-between font-semibold">
            {{ item.name }}
          </div>
          <div class="flex flex-wrap justify-between items-center gap-2 text-gray-500">
            <div class="flex items-center gap-4 mt-2">
              <span>Rp {{ item.price?.toLocaleString() }}</span>
              <input
                type="number"
                min="1"
                :value="item.qty"
                @change="(e) => cartStore.updateItem(item.id, parseInt(e.target.value) || 1)"
                class="w-16 p-1 border rounded"
              />
            </div>
            <div class="flex gap-2 items-center">
              <span class="font-bold text-sky-950">
                Rp {{ (item.price * item.qty).toLocaleString() }}
              </span>
              <button
                @click="onDeleteHandler(item)"
                class="text-red-800 font-bold cursor-pointer hover:text-red-600 px-1"
              >
                X
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="mt-auto pt-2 border-t">
      <div class="flex justify-between">
        <span class="text-gray-500">Subtotal</span>
        <span class="font-bold text-lg">
          Rp {{ cartStore.subtotal.toLocaleString() }}
        </span>
      </div>
      <button
        @click="onCheckout"
        class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mt-2 cursor-pointer transition-colors"
      >
        Konfirmasi
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { createTransaction } from '@/services/transactionService';
import { updateStock, getProductById } from '@/services/productService';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const cartStore = useCartStore();
const authStore = useAuthStore();

const generateStrukPDF = (transactionData) => {
  const { transactionId, date, items, subtotal, payment, change, cashier } = transactionData;
  const doc = new jsPDF({ unit: 'mm', format: [58, 200] });
  const leftMargin = 2;
  const maxWidth = 54;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FINSENSE', leftMargin + maxWidth / 2, 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Kasir : ${cashier}`, leftMargin, 10);
  doc.text(`Tanggal: ${date}`, leftMargin, 15);
  doc.text(`ID Trx : ${transactionId}`, leftMargin, 20);
  doc.line(leftMargin, 23, leftMargin + maxWidth, 23);

  const tableHeaders = [['Item', 'Qty', 'Harga', 'Total']];
  const tableRows = items.map((item) => [
    item.name,
    item.qty,
    `Rp${item.price.toLocaleString()}`,
    `Rp${(item.price * item.qty).toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 25,
    head: tableHeaders,
    body: tableRows,
    theme: 'plain',
    styles: { fontSize: 6, cellPadding: 1, halign: 'left' },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 6,
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 6, halign: 'center' },
      2: { cellWidth: 12, halign: 'right' },
      3: { cellWidth: 14, halign: 'right' },
    },
    margin: { left: leftMargin, right: 2 },
    tableWidth: maxWidth,
  });

  let finalY = doc.lastAutoTable.finalY + 2;
  doc.line(leftMargin, finalY, leftMargin + maxWidth, finalY);
  finalY += 3;
  doc.setFontSize(7);
  doc.text(
    `Subtotal   : Rp${subtotal.toLocaleString()}`,
    leftMargin + maxWidth - 2,
    finalY,
    { align: 'right' }
  );
  finalY += 5;
  doc.text(
    `Dibayar    : Rp${payment.toLocaleString()}`,
    leftMargin + maxWidth - 2,
    finalY,
    { align: 'right' }
  );
  finalY += 5;
  doc.text(
    `Kembalian  : Rp${change.toLocaleString()}`,
    leftMargin + maxWidth - 2,
    finalY,
    { align: 'right' }
  );
  finalY += 5;
  doc.line(leftMargin, finalY, leftMargin + maxWidth, finalY);
  finalY += 3;
  doc.setFont('helvetica', 'italic');
  doc.text('Terima kasih!', leftMargin + maxWidth / 2, finalY, {
    align: 'center',
  });
  finalY += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('FinSense POS', leftMargin + maxWidth / 2, finalY, {
    align: 'center',
  });
  doc.save(`struk_${transactionId}.pdf`);
};

const onDeleteHandler = (item) => {
  Swal.fire({
    title: 'Hapus Item?',
    text: `Yakin ingin menghapus ${item.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) cartStore.removeItem(item.id);
  });
};

const onCheckout = async () => {
  const cart = cartStore.cart;
  const subtotal = cartStore.subtotal;

  if (cart.length === 0) {
    Swal.fire('Keranjang kosong', 'Tambahkan produk terlebih dahulu', 'info');
    return;
  }

  const confirm = await Swal.fire({
    title: 'Konfirmasi Transaksi',
    text: `Total Rp ${subtotal.toLocaleString()}. Lanjutkan ke pembayaran?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, lanjut',
  });
  if (!confirm.isConfirmed) return;

  const { value: paymentAmount } = await Swal.fire({
    title: 'Jumlah Bayar',
    input: 'number',
    inputLabel: `Total belanja: Rp ${subtotal.toLocaleString()}`,
    inputPlaceholder: 'Masukkan jumlah uang customer',
    inputAttributes: { min: subtotal, step: '1' },
    showCancelButton: true,
    confirmButtonText: 'Hitung Kembalian',
    preConfirm: (amount) => {
      const num = Number(amount);
      if (isNaN(num) || num < subtotal) {
        Swal.showValidationMessage(`Jumlah bayar minimal Rp ${subtotal.toLocaleString()}`);
        return false;
      }
      return num;
    },
  });
  if (!paymentAmount) return;
  const change = paymentAmount - subtotal;

  const finalConfirm = await Swal.fire({
    title: 'Detail Pembayaran',
    html: `
      <div style="text-align: left">
        <p><strong>Subtotal:</strong> Rp ${subtotal.toLocaleString()}</p>
        <p><strong>Dibayar:</strong> Rp ${paymentAmount.toLocaleString()}</p>
        <p><strong>Kembalian:</strong> Rp ${change.toLocaleString()}</p>
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Cetak Struk & Proses',
    cancelButtonText: 'Batal',
  });
  if (!finalConfirm.isConfirmed) return;

  try {
    // Stock verification
    for (let item of cart) {
      const product = await getProductById(item.id);
      const currentStock = product.data?.stock ?? product.stock;
      if (currentStock < item.qty) {
        await Swal.fire({
          title: 'Stok tidak mencukupi',
          html: `${item.name}<br/>Stok tersedia: ${currentStock}<br/>Diminta: ${item.qty}`,
          icon: 'error',
        });
        return;
      }
    }

    const items = cart.map((item) => ({
      item_name: item.name,
      quantity: item.qty,
      unit: 'pcs',
      unit_price: item.price,
      product_id: item.id,
    }));

    const transactionPayload = {
      category_id: 1,
      type: 'income',
      amount: subtotal,
      description: `Penjualan POS - ${cart.length} item`,
      transaction_date: new Date().toISOString(),
      source: 'ai',
      items: items,
    };

    const response = await createTransaction(transactionPayload);
    const transactionId = response.data?.id || response.id || 'Unknown';

    for (let item of cart) {
      await updateStock(item.id, {
        quantity: item.qty,
        type: 'out',
        note: 'Penjualan POS',
      });
    }

    const cashierName = authStore.user?.full_name || 'Kasir';

    generateStrukPDF({
      transactionId,
      date: new Date().toLocaleString('id-ID'),
      items: cart,
      subtotal,
      payment: paymentAmount,
      change,
      cashier: cashierName,
    });

    Swal.fire('Sukses', 'Transaksi berhasil diproses & struk diunduh', 'success');
    cartStore.emptyCart();
  } catch (err) {
    console.error(err);
    Swal.fire('Gagal', err.response?.data?.error || 'Terjadi kesalahan', 'error');
  }
};
</script>

