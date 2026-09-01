<template>
  <Loading v-if="authStore.loading" fullScreen text="Memuat dashboard..." />
  <div v-else-if="authStore.user" class="flex h-screen w-full bg-gray-100 relative overflow-hidden">
    <!-- Sidebar untuk desktop & mobile -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <Sidebar @close="sidebarOpen = false" />
    </div>

    <!-- Overlay untuk mobile saat sidebar terbuka -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
      @click="sidebarOpen = false"
    />

    <!-- Konten utama -->
    <div class="flex-1 flex flex-col overflow-hidden w-full">
      <Topbar @menu-click="sidebarOpen = true" />
      <div class="flex-1 overflow-y-auto p-4 md:p-6">
        <RouterView />
      </div>
    </div>

    <!-- Chat component -->
    <div class="fixed bottom-4 right-4 z-20">
      <Chat />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Sidebar from './Sidebar.vue';
import Topbar from './Topbar.vue';
import Chat from '../features/Chat/Chat.vue';
import Loading from '../common/Loading.vue';

const router = useRouter();
const authStore = useAuthStore();
const sidebarOpen = ref(false);

onMounted(() => {
  if (!authStore.loading && !authStore.user) {
    router.push('/login');
  }
});
</script>

