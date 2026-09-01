<template>
  <div class="flex flex-col gap-4">
    <StatDashboard />
    <div class="flex flex-col md:flex-row w-full gap-4">
      <div class="w-full md:w-3/5 flex flex-col gap-4">
        <GrafikDashboard />
      </div>
      <div class="w-full md:w-2/5 flex flex-col gap-4">
        <StokDashboard />
        <LakuDashboard />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatDashboard from '@/components/features/Dashboard/StatDashboard.vue';
import GrafikDashboard from '@/components/features/Dashboard/GrafikDashboard.vue';
import StokDashboard from '@/components/features/Dashboard/StokDashboard.vue';
import LakuDashboard from '@/components/features/Dashboard/LakuDashboard.vue';
</script>

