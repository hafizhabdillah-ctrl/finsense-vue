<template>
  <div class="w-64 h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto shadow-lg lg:shadow-none">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4">
      <div class="flex items-center">
        <img :src="logo" alt="logo" class="h-10 w-10 md:h-14 md:w-14 object-contain" />
        <h1 class="font-bold py-1 px-2 text-2xl md:text-3xl">
          Fin<span class="text-orange-300">Sense</span>
        </h1>
      </div>
      <button
        @click="$emit('close')"
        class="lg:hidden text-gray-500 hover:text-gray-700"
      >
        <X :size="24" />
      </button>
    </div>

    <!-- New Item -->
    <div class="mx-4 mt-2">
      <RouterLink
        to="/new"
        @click="$emit('close')"
        class="w-full bg-sky-950 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-sky-900 transition-colors"
      >
        <PlusCircle :size="20" />
        <span>New Item</span>
      </RouterLink>
    </div>

    <!-- Menu Items -->
    <div class="mx-4 mt-8 text-sm">
      <div v-for="item in menuItems" :key="item.name" class="mb-2">
        <RouterLink
          :to="item.path"
          @click="$emit('close')"
          v-slot="{ isActive }"
        >
          <div
            :class="[
              'w-full py-3 flex items-center justify-start rounded-lg transition',
              isActive
                ? 'bg-sky-100 text-sky-900 font-bold border-l-4 border-sky-800'
                : 'text-gray-500 font-medium border-l-4 border-transparent hover:bg-gray-50'
            ]"
          >
            <div class="mx-4">
              <component :is="item.icon" :size="22" />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="flex flex-col mt-auto py-4 text-gray-600">
      <hr class="border-t border-gray-300 mx-4 mb-4" />
      <button
        @click="handleLogout"
        class="flex mx-4 py-2 px-2 gap-2 items-center cursor-pointer hover:bg-gray-300 rounded-lg hover:text-gray-900 transition-colors"
      >
        <LogOut :size="18" />
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import logo from '@images/logo.png';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Store,
  Users,
  History,
  PlusCircle,
  LogOut,
  X
} from 'lucide-vue-next';

defineEmits(['close']);

const router = useRouter();
const authStore = useAuthStore();

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Catatan Keuangan', icon: Receipt, path: '/transactions' },
  { name: 'Manajemen Stok', icon: Package, path: '/stocks' },
  { name: 'POS Terminal', icon: Store, path: '/pos' },
  { name: 'Hutang Pelanggan', icon: Users, path: '/debts' },
  { name: 'Log Inventori', icon: History, path: '/logs' },
];

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout gagal:', error);
  }
};
</script>

