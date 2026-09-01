<template>
  <form @submit.prevent="handleSubmit" class="w-full">
    <!-- Full Name Input -->
    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-2 text-left">
        Nama Lengkap
      </label>
      <input
        type="text"
        placeholder="Masukkan nama lengkap Anda"
        v-model="fullName"
        class="w-full p-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400"
        required
      />
    </div>

    <!-- Email Input -->
    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-2 text-left">
        Email
      </label>
      <input
        type="email"
        placeholder="Masukkan email Anda"
        v-model="email"
        class="w-full p-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400"
        required
      />
    </div>

    <!-- Password Input with Eye Icon -->
    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-2 text-left">
        Password
      </label>
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Masukkan password Anda"
          v-model="password"
          class="w-full p-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400"
          required
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
          :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
        >
          <EyeOff v-if="showPassword" :size="20" class="text-gray-500 hover:text-sky-700" />
          <Eye v-else :size="20" class="text-gray-500 hover:text-sky-700" />
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-1 text-left">
        Password minimal 6 karakter
      </p>
    </div>

    <!-- Confirm Password Input -->
    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-2 text-left">
        Konfirmasi Password
      </label>
      <div class="relative">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Konfirmasi password Anda"
          v-model="confirmPassword"
          class="w-full p-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400"
          required
        />
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
          :aria-label="showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'"
        >
          <EyeOff v-if="showConfirmPassword" :size="20" class="text-gray-500 hover:text-sky-700" />
          <Eye v-else :size="20" class="text-gray-500 hover:text-sky-700" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600 text-sm text-center">{{ error }}</p>
    </div>

    <!-- Register Button -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-sky-950 text-white font-bold rounded-lg py-3 cursor-pointer transition-all duration-200 hover:bg-sky-900 active:scale-98 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      <span v-if="loading" class="flex items-center justify-center gap-2">
        <svg
          class="animate-spin h-5 w-5 text-white"
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
      <span v-else>Register akun</span>
    </button>

    <!-- Linebreak -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">atau</span>
      </div>
    </div>

    <!-- Footer Card -->
    <p class="text-gray-500 text-center">
      Sudah punya akun?{' '}
      <RouterLink
        to="/login"
        class="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors"
      >
        Login disini
      </RouterLink>
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Password dan Konfirmasi Password tidak cocok';
    return;
  }
  if (password.value.length < 6) {
    error.value = 'Password minimal 6 karakter';
    return;
  }
  if (!fullName.value.trim()) {
    error.value = 'Nama lengkap harus diisi';
    return;
  }
  if (!email.value.trim()) {
    error.value = 'Email harus diisi';
    return;
  }

  loading.value = true;

  try {
    await authStore.register(email.value, password.value, fullName.value);
    router.push('/login');
  } catch (err) {
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error;
    } else {
      error.value = 'Registrasi gagal. Email mungkin sudah terdaftar atau server error.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

