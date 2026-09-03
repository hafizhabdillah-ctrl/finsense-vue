<template>
  <form @submit.prevent="handleSubmit" class="w-full">
    <!-- Email Input -->
    <div class="mb-4">
      <label class="block text-gray-300 font-semibold mb-2 text-left">
        Email
      </label>
      <input
        type="email"
        placeholder="Masukkan email Anda"
        v-model="email"
        class="w-full p-3 text-base border-2 border-transparent rounded-lg bg-blue-50/90 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-800 placeholder-gray-500"
        required
      />
    </div>

    <!-- Password Input with Eye Icon -->
    <div class="mb-4">
      <label class="block text-gray-300 font-semibold mb-2 text-left">
        Password
      </label>
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Masukkan password Anda"
          v-model="password"
          class="w-full p-3 text-base border-2 border-transparent rounded-lg bg-blue-50/90 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-800 placeholder-gray-500"
          required
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 hover:bg-black/5 rounded-full transition-colors"
          :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
        >
          <EyeOff v-if="showPassword" :size="20" class="text-gray-500 hover:text-orange-500" />
          <Eye v-else :size="20" class="text-gray-500 hover:text-orange-500" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
      <p class="text-red-400 text-sm text-center">{{ error }}</p>
    </div>

    <!-- Remember Me & Forgot Password -->
    <div class="flex flex-row items-center justify-between mb-6">
      <label class="flex items-center gap-2 cursor-pointer text-gray-300 font-semibold">
        <input
          type="checkbox"
          v-model="rememberMe"
          class="w-4 h-4 border-2 border-gray-500 rounded accent-orange-500 cursor-pointer transition-colors"
        />
        <span class="select-none">Ingat Saya</span>
      </label>
      <RouterLink
        to="/lupa-password"
        class="text-orange-500 font-semibold cursor-pointer hover:text-orange-400 transition-colors"
      >
        Lupa password?
      </RouterLink>
    </div>

    <!-- Login Button -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-orange-500 text-black font-bold rounded-lg py-3 cursor-pointer transition-all duration-200 hover:bg-orange-400 active:scale-98 disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
    >
      <span v-if="loading" class="flex items-center justify-center gap-2">
        <svg
          class="animate-spin h-5 w-5 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Memproses...
      </span>
      <span v-else>Log in</span>
    </button>

    <!-- Linebreak -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-white/10"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-neutral-900 text-gray-500">atau</span>
      </div>
    </div>

    <!-- Footer Card -->
    <p class="text-gray-400 text-center">
      Belum punya akun?
      <RouterLink
        to="/register"
        class="text-orange-500 font-bold cursor-pointer hover:text-orange-400 transition-colors"
      >
        Daftar di sini
      </RouterLink>
    </p>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const error = ref('');
const loading = ref(false);

onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.value = true;
  }
});

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    router.push('/dashboard');
  } catch (err) {
    error.value = 'Login gagal. Periksa email dan password.';
  } finally {
    loading.value = false;
  }
};
</script>

