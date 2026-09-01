<template>
  <div class="w-full p-4 bg-white border border-gray-300 rounded-md shadow-sm overflow-x-auto">
    <div class="min-w-[300px]">
      <Line :data="data" :options="options" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useDashboardData } from '@/composables/useDashboardData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const { chartData } = useDashboardData();

const data = computed(() => ({
  labels: chartData.value.dates,
  datasets: [
    {
      label: 'Pemasukan (Rp)',
      data: chartData.value.amounts,
      borderColor: '#0c4a6e',
      backgroundColor: 'rgba(12, 74, 110, 0.1)',
      tension: 0.3,
      fill: true,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Penjualan 7 Hari Terakhir' },
  },
};
</script>

