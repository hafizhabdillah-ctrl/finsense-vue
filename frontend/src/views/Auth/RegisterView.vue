<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200 p-4">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div class="flex flex-col items-center">
        <!-- Logo and Name -->
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
</script>

