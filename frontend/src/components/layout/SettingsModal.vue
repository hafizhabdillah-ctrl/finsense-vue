<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Pengaturan</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X :size="24" />
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-200 px-6">
        <button
          @click="activeTab = 'profile'"
          :class="[
            'px-4 py-3 font-medium transition-colors border-b-2 cursor-pointer',
            activeTab === 'profile'
              ? 'border-sky-950 text-sky-950'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          User
        </button>
        <button
          @click="activeTab = 'umkm'"
          :class="[
            'px-4 py-3 font-medium transition-colors border-b-2 cursor-pointer',
            activeTab === 'umkm'
              ? 'border-sky-950 text-sky-950'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          UMKM
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="profileLoading" class="text-center py-8">Memuat data...</div>
        <template v-else>
          <!-- Profile User Tab -->
          <form v-if="activeTab === 'profile'" @submit.prevent="handleUserSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  v-model="userForm.full_name"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  v-model="userForm.email"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div class="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-6 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-6 py-2 bg-sky-950 text-white rounded-lg hover:bg-sky-900 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </div>
          </form>

          <!-- Profile UMKM Tab -->
          <form v-if="activeTab === 'umkm'" @submit.prevent="handleUmkmSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Bisnis
                </label>
                <input
                  type="text"
                  v-model="umkmForm.business_name"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
                  placeholder="Masukkan nama bisnis"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Bisnis
                </label>
                <input
                  type="text"
                  v-model="umkmForm.business_type"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
                  placeholder="Contoh: Makanan, Fashion, Elektronik"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    v-model="umkmForm.province"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
                    placeholder="Provinsi"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kota
                  </label>
                  <input
                    type="text"
                    v-model="umkmForm.city"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
                    placeholder="Kota"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Estimasi Pendapatan Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    v-model="umkmForm.monthly_revenue_est"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Karyawan
                  </label>
                  <input
                    type="number"
                    v-model="umkmForm.employee_count"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition"
                    placeholder="0"
                  />
                </div>
              </div>

              <div class="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-6 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-6 py-2 bg-sky-950 text-white rounded-lg hover:bg-sky-900 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import Swal from 'sweetalert2';
import { X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const activeTab = ref('profile');
const loading = ref(false);
const profileLoading = ref(false);

const userForm = ref({
  full_name: '',
  email: ''
});

const umkmForm = ref({
  business_name: '',
  business_type: '',
  province: '',
  city: '',
  monthly_revenue_est: '',
  employee_count: ''
});

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    profileLoading.value = true;
    try {
      const userRes = await api.get('/auth/profile');
      const userData = userRes.data;
      userForm.value = {
        full_name: userData.full_name || '',
        email: userData.email || ''
      };

      const umkmRes = await api.get('/umkm');
      const umkmData = umkmRes.data;
      umkmForm.value = {
        business_name: umkmData.business_name || '',
        business_type: umkmData.business_type || '',
        province: umkmData.province || '',
        city: umkmData.city || '',
        monthly_revenue_est: umkmData.monthly_revenue_est || '',
        employee_count: umkmData.employee_count || ''
      };
    } catch (err) {
      console.error(err);
    } finally {
      profileLoading.value = false;
    }
  }
});

const handleUserSubmit = async () => {
  loading.value = true;
  try {
    const response = await api.put('/auth/profile', {
      full_name: userForm.value.full_name,
      email: userForm.value.email
    });
    if (authStore.user) {
      authStore.user.full_name = response.data.full_name;
    }
    Swal.fire('Berhasil', 'Profil berhasil diperbarui', 'success');
    emit('close');
  } catch (err) {
    const msg = err.response?.data?.error || 'Gagal memperbarui profil';
    Swal.fire('Gagal', msg, 'error');
  } finally {
    loading.value = false;
  }
};

const handleUmkmSubmit = async () => {
  loading.value = true;
  try {
    const payload = {
      business_name: umkmForm.value.business_name,
      business_type: umkmForm.value.business_type,
      province: umkmForm.value.province,
      city: umkmForm.value.city,
      monthly_revenue_est: umkmForm.value.monthly_revenue_est
        ? parseFloat(umkmForm.value.monthly_revenue_est)
        : null,
      employee_count: umkmForm.value.employee_count
        ? parseInt(umkmForm.value.employee_count)
        : null
    };
    const response = await api.post('/umkm', payload);
    if (authStore.user) {
      authStore.user.umkm_profile = response.data;
    }
    Swal.fire('Berhasil', 'Profil UMKM berhasil diperbarui', 'success');
    emit('close');
  } catch (err) {
    const msg = err.response?.data?.error || 'Gagal memperbarui profil UMKM';
    Swal.fire('Gagal', msg, 'error');
  } finally {
    loading.value = false;
  }
};
</script>

