<template>
  <div class="p-2">
    <div class="flex flex-col gap-4 w-full sm:w-1/2">
      <button
        v-for="(item, index) in menuItems"
        :key="index"
        @click="router.push(item.link)"
        class="flex flex-col items-start p-4 bg-sky-950 border rounded-md text-left hover:text-sky-950 hover:shadow-md hover:bg-white hover:border-sky-950 transition-all cursor-pointer group w-full"
      >
        <h3 class="text-lg font-bold text-white group-hover:text-sky-950">
          {{ item.title }}
        </h3>
        <p class="text-sm text-sky-200 group-hover:text-gray-500 mt-1">
          {{ item.description }}
        </p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const menuItems = [
  {
    title: 'Tambah Transaksi',
    description: 'Catat pemasukan atau pengeluaran yang dilakukan',
    link: '/transactions/new',
  },
  {
    title: 'Tambah Barang',
    description: 'Masukkan barang yang baru tiba atau restock',
    link: '/stocks/new',
  },
  {
    title: 'Tambah Log POS Terminal',
    description: 'Catat aktivitas terminal POS secara manual',
    link: '/pos/new',
  },
  {
    title: 'Tambah Piutang',
    description: 'Catat hutang atau piutang pelanggan',
    link: '/debts/new',
  },
  {
    title: 'Tambah Log Barang',
    description: 'Catat riwayat pergerakan dan penyesuaian',
    link: '/logs/new',
  },
];
</script>

