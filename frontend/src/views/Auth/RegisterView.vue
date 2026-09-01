<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200 p-4">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div class="flex flex-col items-center">
        <!-- Logo and Name -->
        <div class="flex flex-row items-center mb-4">
          <img :src="logo" alt="logo" class="h-10 w-10 sm:h-12 sm:w-12 mx-2 object-contain" />
          <h1 class="text-2xl sm:text-3xl font-bold text-sky-950">
            Fin<span class="text-orange-400">Sense</span>
          </h1>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-sky-950 mb-2 text-center">
          Selamat Datang
        </h2>
        <p class="text-gray-500 text-sm sm:text-base mb-6 text-center">
          Buat akun baru untuk manajemen bisnis Anda.
        </p>

        <div class="w-full">
          <RegisterInput />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RegisterInput from '@/components/features/Auth/RegisterInput.vue';
import logo from '@images/logo.png';
</script>

