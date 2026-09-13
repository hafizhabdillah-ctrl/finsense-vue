<template>
  <div>
    <h1 class="text-xl md:text-2xl font-bold">Statistik Penjualan</h1>
    <p class="mx-2 mb-4 md:mb-6 text-gray-500 text-sm">{{ todayLabel }}</p>
    <StatDashboard />
    <!-- Grafik 3/4 lebar, Rekomendasi Restok 1/4 lebar (desktop) -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
      <div class="lg:col-span-3">
        <GrafikDashboard />
      </div>
      <div class="lg:col-span-1">
        <StokDashboard />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatDashboard from '@/components/features/Dashboard/StatDashboard.vue';
import GrafikDashboard from '@/components/features/Dashboard/GrafikDashboard.vue';
import StokDashboard from '@/components/features/Dashboard/StokDashboard.vue';

const todayLabel = new Date().toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
</script>
