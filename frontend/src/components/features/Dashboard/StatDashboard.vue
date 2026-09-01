<template>
  <div v-if="loading" class="flex gap-4 p-4 text-gray-500">
    Memuat statistik...
  </div>
  <div v-else class="flex flex-col w-full gap-4">
    <!-- statistik -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h2 class="text-gray-500 text-sm font-semibold">
          PEMASUKAN HARI INI
        </h2>
        <p class="text-xl md:text-2xl font-bold text-sky-950">
          Rp {{ todayIncome.toLocaleString() }}
        </p>
      </div>
      <div class="flex-1 bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h2 class="text-gray-500 text-sm font-semibold">
          TOTAL TRANSAKSI HARI INI
        </h2>
        <p class="text-2xl font-bold text-sky-950">{{ todayCount }}</p>
      </div>
      <div class="flex-1 bg-white p-4 border rounded-md border-gray-300 shadow-sm">
        <h2 class="text-gray-500 text-sm font-semibold">
          RATA-RATA ORDER HARI INI
        </h2>
        <p class="text-2xl font-bold text-sky-950">
          Rp {{ Math.round(averageOrder).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- PREDIKSI PEMASUKAN -->
    <div v-if="revenuePrediction" class="w-full bg-blue-50 p-4 rounded-md shadow-sm border border-gray-300">
      <div class="flex gap-1">
        <h2 class="text-gray-500 text-sm font-semibold">
          Prediksi Pemasukan Besok
        </h2>
        <span class="flex font-semibold items-start text-green-500 text-xs">
          AI Powered
        </span>
      </div>
      <p class="text-2xl font-bold text-blue-900 mb-2">
        <span v-if="typeof revenuePrediction.predicted_revenue === 'string' && revenuePrediction.predicted_revenue === '......'" class="text-gray-400">
          ......
        </span>
        <span v-else>
          Rp {{ (revenuePrediction.predicted_revenue ?? 0).toLocaleString() }}
        </span>
      </p>
      <p v-if="predictionMessage" class="text-xs text-yellow-600">{{ predictionMessage }}</p>
      <p class="text-xs text-gray-500">{{ revenuePrediction.prediction_date }}</p>
    </div>
  </div>
</template>

<script setup>
import { useDashboardData } from '@/composables/useDashboardData';

const {
  todayIncome,
  todayCount,
  averageOrder,
  loading,
  revenuePrediction,
  predictionMessage,
} = useDashboardData();
</script>

