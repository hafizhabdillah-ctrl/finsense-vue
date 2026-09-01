<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200">
    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
      <div class="flex flex-col items-center">
        <div class="flex flex-row items-center">
          <img :src="logo" alt="logo" class="h-12 w-12 mb-2 mx-2 object-contain" />
          <h1 class="text-3xl font-bold text-sky-950">
            Fin<span class="text-orange-400">Sense</span>
          </h1>
        </div>
        <p class="text-gray-500 text-sm mb-4 text-center">
          Masukkan email Anda, kami akan kirimkan link reset password.
        </p>
        <form @submit.prevent="handleSubmit" class="w-full">
          <input
            type="email"
            placeholder="Email"
            v-model="email"
            class="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 transition-colors"
            required
          />
          <p v-if="message" class="text-green-500 text-sm mb-2">{{ message }}</p>
          <p v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-sky-950 text-white font-bold rounded-lg py-2 disabled:opacity-50 cursor-pointer hover:bg-sky-900 transition-colors"
          >
            {{ loading ? 'Mengirim...' : 'Kirim Link Reset' }}
          </button>
        </form>
        <div class="mt-4 text-center">
          <RouterLink to="/login" class="text-orange-500 font-bold hover:text-orange-600">
            Kembali ke Login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import logo from '@images/logo.png';

const authStore = useAuthStore();
const email = ref('');
const message = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  message.value = '';
  error.value = '';
  try {
    const result = await authStore.forgotPassword(email.value);
    message.value = result.message;
  } catch (err) {
    error.value = err.response?.data?.error || 'Gagal mengirim permintaan.';
  } finally {
    loading.value = false;
  }
};
</script>

