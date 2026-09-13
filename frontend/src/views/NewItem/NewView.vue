<template>
  <div class="py-2 px-4">
    <!-- Header -->
    <h1 class="p-2 text-gray-700 text-2xl font-bold">Tambah Item Baru</h1>
    <p class="px-2 text-gray-500 text-sm">Pilih kategori item yang ingin ditambahkan lalu isi formulir di bawah.</p>
    <NewItem />
  </div>
</template>

<script setup>
import NewItem from '@/components/NewItem/NewItem.vue';
</script>

