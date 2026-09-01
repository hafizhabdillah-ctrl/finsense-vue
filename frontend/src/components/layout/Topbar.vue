<template>
  <div class="sticky top-0 z-30 flex items-center justify-between w-full py-3 px-4 md:py-4 border-b border-gray-200 bg-white">
    <!-- Kiri: Tombol menu (mobile) + back -->
    <div class="flex items-center gap-2">
      <button
        @click="$emit('menu-click')"
        class="lg:hidden text-gray-600 hover:text-gray-900 p-1 rounded-md focus:outline-none"
      >
        <Menu :size="28" />
      </button>
      <button
        @click="router.back()"
        class="hidden sm:block text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors"
      >
        <span class="text-2xl">&larr;</span>
      </button>
    </div>

    <!-- Kanan: Settings, Profile -->
    <div class="flex items-center gap-2 md:gap-4 text-gray-500">
      <button
        @click="isSettingsModalOpen = true"
        class="cursor-pointer hover:text-gray-700 transition-colors p-1"
      >
        <Settings :size="26" />
      </button>
      <div class="pl-2 md:pl-4 border-l border-gray-300 font-semibold text-sky-950">
        {{ authStore.user?.full_name || 'User' }}
      </div>
    </div>
  </div>

  <SettingsModal
    :isOpen="isSettingsModalOpen"
    @close="isSettingsModalOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SettingsModal from './SettingsModal.vue';
import { Menu, Settings } from 'lucide-vue-next';

defineEmits(['menu-click']);

const router = useRouter();
const authStore = useAuthStore();
const isSettingsModalOpen = ref(false);
</script>

