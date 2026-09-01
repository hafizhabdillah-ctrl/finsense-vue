<template>
  <div class="flex flex-col md:flex-row gap-4 bg-white p-4 w-full md:w-3/4 border border-gray-200 rounded-lg shadow-sm">
    <!-- Grafik Pemasukan -->
    <div class="flex-1 text-center">
      <p class="text-xs font-bold text-gray-500 mb-2 uppercase">
        ALOKASI PEMASUKAN
      </p>
      <div class="w-48 h-48 mx-auto mt-2 relative">
        <Doughnut v-if="hasIncomeData" :data="incomeData" :options="chartOptions" />
        <template v-else>
          <Doughnut :data="emptyData" :options="chartOptions" />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-[10px] text-gray-400 font-semibold">
              KOSONG
            </span>
          </div>
        </template>
      </div>
    </div>

    <!-- Grafik Pengeluaran -->
    <div class="flex-1 text-center">
      <p class="text-xs font-bold text-gray-500 mb-2 uppercase">
        ALOKASI PENGELUARAN
      </p>
      <div class="w-48 h-48 mx-auto mt-2 relative">
        <Doughnut v-if="hasExpenseData" :data="expenseData" :options="chartOptions" />
        <template v-else>
          <Doughnut :data="emptyData" :options="chartOptions" />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-[10px] text-gray-400 font-semibold">
              KOSONG
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTransactions } from '@/composables/useTransactions';

ChartJS.register(ArcElement, Tooltip, Legend);

const { transactions } = useTransactions();

const getChartData = (type) => {
  const filtered = transactions.value.filter((t) => t.type === type);

  const getCategoryName = (category) => {
    if (!category) return 'Lainnya';
    if (typeof category === 'object') return category.name || 'Unknown';
    return String(category);
  };

  const labels = [...new Set(filtered.map((t) => getCategoryName(t.category)))];

  const dataPoints = labels.map((label) =>
    filtered
      .filter((t) => getCategoryName(t.category) === label)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const total = dataPoints.reduce((a, b) => a + b, 0);
  const percentages = dataPoints.map((val) =>
    total > 0 ? ((val / total) * 100).toFixed(1) : 0
  );

  const formattedLabels = labels.map((label, idx) => `${label} - ${percentages[idx]}%`);

  return {
    labels: formattedLabels,
    datasets: [
      {
        data: dataPoints,
        backgroundColor: [
          '#0ea5e9',
          '#22c55e',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
        ],
        borderWidth: 1,
      },
    ],
  };
};

const incomeData = computed(() => getChartData('income'));
const expenseData = computed(() => getChartData('expense'));

const hasIncomeData = computed(
  () =>
    incomeData.value.datasets[0].data.length > 0 &&
    incomeData.value.datasets[0].data.reduce((a, b) => a + b, 0) > 0
);

const hasExpenseData = computed(
  () =>
    expenseData.value.datasets[0].data.length > 0 &&
    expenseData.value.datasets[0].data.reduce((a, b) => a + b, 0) > 0
);

const emptyData = {
  labels: ['Tidak ada data'],
  datasets: [
    {
      data: [1],
      backgroundColor: ['#e5e7eb'],
      borderWidth: 0,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 11 },
      padding: 10,
      displayColors: false,
      callbacks: {
        title: (context) => context[0].label,
        label: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
        },
      },
    },
  },
  cutout: '70%',
};
</script>

