<template>
  <div v-if="!token" class="min-h-screen flex items-center justify-center bg-gray-200">
    <div class="bg-white p-8 rounded-2xl shadow-xl text-center">
      <p class="text-red-500 mb-4">
        Token tidak valid atau sudah kadaluarsa.
      </p>
      <RouterLink to="/login" class="text-orange-500 font-bold">
        Kembali ke Login
      </RouterLink>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-gray-200 p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 p-6 sm:p-8">
      <div class="flex flex-col items-center">
        <!-- Logo dan Nama -->
        <div class="flex flex-row items-center mb-4">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 sm:h-12 sm:w-12 mx-2 object-contain">
            <path d="M2 3h4.2L12 13l5.8-10H22L12 21 2 3Z" fill="#41B883"/>
            <path d="M6.2 3H9.5L12 7.2 14.5 3H17.8L12 13 6.2 3Z" fill="#35495E"/>
          </svg>
          <h1 class="text-2xl sm:text-3xl font-bold text-sky-950">
            Fin<span class="text-orange-400">Sense</span>
          </h1>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-sky-950 mb-2 text-center">
          Reset Password
        </h2>
        <p class="text-gray-500 text-sm sm:text-base mb-6 text-center">
          Masukkan password baru Anda.
        </p>

        <form @submit.prevent="handleSubmit" class="w-full">
          <!-- Field Password Baru -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Password Baru
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 6 karakter"
                v-model="password"
                class="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-sky-800"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-sky-700"
              >
                <EyeOff v-if="showPassword" :size="20" />
                <Eye v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- Field Konfirmasi Password -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Konfirmasi Password
            </label>
            <div class="relative">
              <input
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Ulangi password baru"
                v-model="confirm"
                class="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-sky-800"
                required
              />
              <button
                type="button"
                @click="showConfirm = !showConfirm"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-sky-700"
              >
                <EyeOff v-if="showConfirm" :size="20" />
                <Eye v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- Pesan Sukses/Error -->
          <div v-if="message" class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {{ message }}
          </div>
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {{ error }}
          </div>

          <!-- Tombol Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-sky-950 text-white font-bold rounded-lg py-3 disabled:opacity-50 hover:bg-sky-800 transition-colors cursor-pointer"
          >
            {{ loading ? 'Memproses...' : 'Reset Password' }}
          </button>

          <!-- Link Kembali ke Login -->
          <div class="mt-4 text-center">
            <RouterLink to="/login" class="text-orange-500 font-bold text-sm">
              Kembali ke Login
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import api from '@/services/api';
import { Eye, EyeOff } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const token = computed(() => route.query.token);
const password = ref('');
const confirm = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);
const message = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  if (password.value !== confirm.value) {
    error.value = 'Password tidak cocok';
    return;
  }
  if (password.value.length < 6) {
    error.value = 'Password minimal 6 karakter';
    return;
  }
  loading.value = true;
  message.value = '';
  error.value = '';
  try {
    const res = await api.post('/auth/reset-password', {
      token: token.value,
      newPassword: password.value,
    });
    message.value = res.data.message;
    setTimeout(() => router.push('/login'), 3000);
  } catch (err) {
    error.value = err.response?.data?.error || 'Gagal reset password';
  } finally {
    loading.value = false;
  }
};
</script>

