<template>
  <div class="px-4 h-full flex flex-col">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <h1 class="text-2xl font-bold">POS Terminal</h1>
      <button
        @click="router.push({ path: '/new', query: { type: 'pos' } })"
        class="flex items-center gap-2 bg-sky-950 p-2 px-4 text-white font-semibold border cursor-pointer rounded-lg hover:bg-white hover:text-sky-950 transition"
      >
        <PlusCircle :size="16" />
        Tambah POS baru
      </button>
    </div>
    <div class="flex flex-col lg:flex-row gap-4 mt-4 flex-1">
      <div class="flex flex-col gap-4 lg:w-3/4">
        <InputPos />
        <FrequentlyPos />
      </div>
      <div class="border border-gray-400 rounded-md w-full lg:w-1/4">
        <CartPos />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import InputPos from '@/components/features/Pos/InputPos.vue';
import FrequentlyPos from '@/components/features/Pos/FrequentlyPos.vue';
import CartPos from '@/components/features/Pos/CartPos.vue';
import { PlusCircle } from 'lucide-vue-next';

const router = useRouter();
</script>

