import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import LoginView from '@/views/Auth/LoginView.vue';
import RegisterView from '@/views/Auth/RegisterView.vue';
import LupaPasswordView from '@/views/Auth/LupaPasswordView.vue';
import ResetPasswordView from '@/views/Auth/ResetPasswordView.vue';
import MainLayout from '@/components/layout/MainLayout.vue';

import DashboardView from '@/views/Features/DashboardView.vue';
import StockView from '@/views/Features/StockView.vue';
import PosView from '@/views/Features/PosView.vue';
import TransactionView from '@/views/Features/TransactionView.vue';
import DebtView from '@/views/Features/DebtView.vue';
import LogView from '@/views/Features/LogView.vue';
import NewView from '@/views/NewItem/NewView.vue';

import NewStock from '@/components/features/Stock/NewStock.vue';
import DetailStock from '@/components/features/Stock/DetailStock.vue';
import EditStock from '@/components/features/Stock/EditStock.vue';

import NewTransaction from '@/components/features/Transaction/NewTransaction.vue';
import DetailTransaction from '@/components/features/Transaction/DetailTransaction.vue';
import EditTransaction from '@/components/features/Transaction/EditTransaction.vue';

import NewPos from '@/components/features/Pos/NewPos.vue';

import NewDebt from '@/components/features/Debt/NewDebt.vue';
import DetailDebt from '@/components/features/Debt/DetailDebt.vue';
import EditDebt from '@/components/features/Debt/EditDebt.vue';

import NewLog from '@/components/features/Log/NewLog.vue';
import DetailLog from '@/components/features/Log/DetailLog.vue';
import EditLog from '@/components/features/Log/EditLog.vue';

import ErrorView from '@/views/Features/ErrorView.vue';

const routes = [
  { path: '/', name: 'main', component: MainView },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/lupa-password', name: 'lupa-password', component: LupaPasswordView },
  { path: '/reset-password', name: 'reset-password', component: ResetPasswordView },

  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardView },
      { path: 'new', name: 'new-item', component: NewView },

      { path: 'transactions', name: 'transactions', component: TransactionView },
      { path: 'transactions/new', name: 'new-transaction', component: NewTransaction },
      { path: 'transactions/:id', name: 'detail-transaction', component: DetailTransaction, props: true },
      { path: 'transactions/edit/:id', name: 'edit-transaction', component: EditTransaction, props: true },

      { path: 'stocks', name: 'stocks', component: StockView },
      { path: 'stocks/new', name: 'new-stock', component: NewStock },
      { path: 'stocks/:id', name: 'detail-stock', component: DetailStock, props: true },
      { path: 'stocks/edit/:id', name: 'edit-stock', component: EditStock, props: true },

      { path: 'pos', name: 'pos', component: PosView },
      { path: 'pos/new', name: 'new-pos', component: NewPos },

      { path: 'debts', name: 'debts', component: DebtView },
      { path: 'debts/new', name: 'new-debt', component: NewDebt },
      { path: 'debts/:id', name: 'detail-debt', component: DetailDebt, props: true },
      { path: 'debts/edit/:id', name: 'edit-debt', component: EditDebt, props: true },

      { path: 'logs', name: 'logs', component: LogView },
      { path: 'logs/new', name: 'new-log', component: NewLog },
      { path: 'logs/:id', name: 'detail-log', component: DetailLog, props: true },
      { path: 'logs/edit/:id', name: 'edit-log', component: EditLog, props: true },
    ]
  },

  { path: '/:pathMatch(.*)*', name: 'error', component: ErrorView }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Add proper auth guard with async support
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('@/stores/auth');
  const authStore = useAuthStore();
  const token = localStorage.getItem('accessToken');

  // If we have a token but auth is still loading, wait for it
  if (token && authStore.loading) {
    // Wait for auth initialization to complete
    await new Promise(resolve => {
      const checkAuth = setInterval(() => {
        if (!authStore.loading) {
          clearInterval(checkAuth);
          resolve();
        }
      }, 50);
      // Safety timeout
      setTimeout(() => clearInterval(checkAuth), 5000);
    });
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!token || !authStore.user) {
      // Redirect to login if trying to access protected route
      next({ 
        name: 'login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } 
  // Check if route is guest only (login, register, etc.)
  else if (to.meta.guestOnly) {
    if (token && authStore.user) {
      // Redirect to dashboard if trying to access guest routes while logged in
      next({ name: 'dashboard' });
    } else {
      next();
    }
  } 
  // All other routes
  else {
    next();
  }
});

// Handle redirect after login
router.afterEach((to) => {
  // Clear query parameters if present
  if (to.query.redirect) {
    const redirectPath = to.query.redirect;
    router.replace({ path: redirectPath });
  }
});

export default router;
