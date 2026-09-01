<template>
  <div v-if="fullScreen" class="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
      <Loader2 :class="[sizeClass, 'text-sky-950 animate-spin']" />
      <p class="text-gray-600 font-medium text-lg">{{ text }}</p>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center p-8">
    <div class="relative">
      <Loader2 :class="[sizeClass, 'text-sky-950 animate-spin']" />
      <div class="absolute inset-0 rounded-full bg-sky-950/10 animate-ping"></div>
    </div>
    <p v-if="text" class="mt-4 text-gray-500 font-medium">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

const props = defineProps({
  size: {
    type: String,
    default: 'md'
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Loading...'
  }
});

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };
  return sizes[props.size] || sizes.md;
});
</script>

