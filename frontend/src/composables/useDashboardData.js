import { ref, onMounted } from 'vue';
import { getTransactions } from '@/services/transactionService';
import { getProducts } from '@/services/productService';
import api from '@/services/api';

export function useDashboardData() {
  const todayIncome = ref(0);
  const todayCount = ref(0);
  const averageOrder = ref(0);
  const lowStockProducts = ref([]);
  const bestSellers = ref([]);
  const loading = ref(true);
  const chartData = ref({ dates: [], amounts: [] });
  const aiPredictions = ref([]);
  const loadingAi = ref(false);
  const revenuePrediction = ref(null);
  const topProductsPrediction = ref([]);
  const predictionMessage = ref('');

  const fetchData = async () => {
    loading.value = true;
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(
        today.setHours(23, 59, 59, 999),
      ).toISOString();

      // 1. Transaksi hari ini
      const todayRes = await getTransactions({
        startDate: startOfDay,
        endDate: endOfDay,
      });
      const todayIncomes = (todayRes.data || []).filter((t) => t.type === 'income');
      const totalIncome = todayIncomes.reduce((s, t) => s + t.amount, 0);
      todayIncome.value = totalIncome;
      todayCount.value = todayIncomes.length;
      averageOrder.value = todayIncomes.length ? totalIncome / todayIncomes.length : 0;

      // 2. Grafik 7 hari
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weeklyRes = await getTransactions({
        startDate: sevenDaysAgo.toISOString(),
        endDate: endOfDay,
      });
      const weeklyIncomes = (weeklyRes.data || []).filter((t) => t.type === 'income');
      const dailyMap = new Map();
      weeklyIncomes.forEach((t) => {
        const date = t.transaction_date.split('T')[0];
        dailyMap.set(date, (dailyMap.get(date) || 0) + t.amount);
      });
      const sortedDates = Array.from(dailyMap.keys()).sort();
      const amounts = sortedDates.map((d) => dailyMap.get(d));
      chartData.value = { dates: sortedDates, amounts };

      // 3. Semua produk
      const productsRes = await getProducts();
      const allProducts = productsRes.data || [];

      // 4. Low stock lokal
      const lowStock = allProducts.filter((p) => p.stock <= p.min_stock);
      lowStockProducts.value = lowStock.slice(0, 10);

      // 5. Best sellers
      try {
        const realTopRes = await api.get('/ai/real-top-products');
        bestSellers.value = (realTopRes.data?.top_products || []).slice(0, 5);
      } catch (err) {
        console.warn('Gagal ambil real top products, fallback ke stock logs');
      }

      // 6. Prediksi Revenue AI
      try {
        const revRes = await api.get('/ai/predict-revenue');
        if (revRes.data?.available === false) {
          predictionMessage.value = revRes.data.message || 'Data transaksi belum cukup';
          revenuePrediction.value = null;
        } else {
          let rawValue = revRes.data?.predicted_revenue;
          let displayValue;
          if (rawValue === null || rawValue === undefined || rawValue <= 0) {
            displayValue = '......';
          } else {
            displayValue = rawValue;
          }
          revenuePrediction.value = {
            predicted_revenue: displayValue,
            prediction_date: revRes.data?.prediction_date || new Date().toISOString().split('T')[0],
          };
          predictionMessage.value = revRes.data?.note || '';
        }
      } catch (err) {
        revenuePrediction.value = null;
        predictionMessage.value = 'Gagal memuat prediksi pendapatan';
      }

      // 7. Prediksi Top Products AI
      try {
        const topRes = await api.get('/ai/predict-top-products');
        if (topRes.data?.available === false) {
          const realTopRes = await api.get('/ai/real-top-products');
          topProductsPrediction.value = realTopRes.data?.top_products || [];
        } else {
          topProductsPrediction.value = topRes.data?.top_products || [];
        }
      } catch (err) {
        try {
          const realTopRes = await api.get('/ai/real-top-products');
          topProductsPrediction.value = realTopRes.data?.top_products || [];
        } catch (e) {
          topProductsPrediction.value = [];
        }
      }
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });

  return {
    todayIncome,
    todayCount,
    averageOrder,
    lowStockProducts,
    bestSellers,
    chartData,
    loading,
    aiPredictions,
    loadingAi,
    revenuePrediction,
    topProductsPrediction,
    predictionMessage,
    refetch: fetchData
  };
}
