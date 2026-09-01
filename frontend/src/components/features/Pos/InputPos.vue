<template>
  <div class="flex flex-col items-center py-4 gap-4">
    <!-- Input pencarian -->
    <div class="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Cari produk..."
        v-model="query"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950"
      />
      <Search class="absolute right-3 top-4 text-gray-400" :size="18" />
      <ul
        v-if="filtered.length > 0"
        class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg"
      >
        <li
          v-for="p in filtered"
          :key="p.id"
          @click="handleAddProduct(p)"
          class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
        >
          <span class="font-medium">{{ p.name }}</span>
          <span class="text-sm text-gray-600">Rp {{ p.price?.toLocaleString() }}</span>
        </li>
      </ul>
    </div>

    <!-- Tombol suara dan status proses -->
    <button
      @click="isListening ? stopListening() : startListening()"
      :disabled="isProcessing"
      :class="[
        'flex p-5 border rounded-xl transition-all cursor-pointer',
        isProcessing
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : isListening
          ? 'bg-white text-red-500 border-red-500 animate-pulse'
          : 'bg-sky-950 text-white hover:bg-white hover:text-sky-950'
      ]"
    >
      <RefreshCw v-if="isProcessing" class="animate-spin" :size="28" />
      <Mic v-else :size="28" />
    </button>

    <p class="text-sm text-gray-500">
      {{
        isProcessing
          ? 'Memproses suara...'
          : isListening
          ? 'Mendengarkan... (klik lagi untuk berhenti)'
          : 'Tekan mikrofon untuk perintah suara'
      }}
    </p>

    <p class="text-sm text-gray-400">
      Contoh: "Jual Mie Goreng 3 bungkus"
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getProducts } from '@/services/productService';
import { useCartStore } from '@/stores/cart';
import api from '@/services/api';
import Swal from 'sweetalert2';
import { Search, Mic, RefreshCw } from 'lucide-vue-next';

const QTY = {
  satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5,
  enam: 6, tujuh: 7, delapan: 8, sembilan: 9, sepuluh: 10,
};
const STRONG_UNITS = new Set([
  'bungkus', 'botol', 'dus', 'pcs', 'pack', 'renteng', 'slop', 'sak',
  'biji', 'buah', 'lusin', 'pak', 'karton', 'box', 'kaleng', 'sachet',
  'tray', 'ikat', 'lembar', 'batang', 'butir',
]);
const WEAK_UNITS = new Set(['kilo', 'kilogram', 'kg', 'liter', 'gram', 'gr']);

function parseJumlah(transcript) {
  if (!transcript) return null;
  const words = transcript.toLowerCase().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    if (QTY[words[i]] && i + 1 < words.length && STRONG_UNITS.has(words[i + 1]))
      return QTY[words[i]];
  }
  for (let i = 0; i < words.length; i++) {
    if (/^\d+$/.test(words[i]) && i + 1 < words.length && STRONG_UNITS.has(words[i + 1])) {
      const v = parseInt(words[i]);
      if (v >= 1 && v <= 10) return v;
    }
  }
  if (words.length && QTY[words[words.length - 1]])
    return QTY[words[words.length - 1]];
  let weak = null;
  for (let i = 0; i < words.length; i++) {
    if (QTY[words[i]] && i + 1 < words.length && WEAK_UNITS.has(words[i + 1]))
      weak = QTY[words[i]];
  }
  if (weak !== null) return weak;
  const skip = new Set(['ratus', 'ribu', 'puluh', 'belas', 'mililiter', 'ml', ...WEAK_UNITS]);
  let cand = null;
  for (let i = 0; i < words.length; i++) {
    if (QTY[words[i]] && !skip.has(words[i + 1] || '')) cand = QTY[words[i]];
  }
  return cand;
}

const query = ref('');
const products = ref([]);
const filtered = ref([]);
const isListening = ref(false);
const isProcessing = ref(false);
const transcript = ref('');
const transcriptRef = ref('');
const audioMimeType = ref('');

const recognitionRef = ref(null);
const mediaRecorderRef = ref(null);
const audioChunksRef = ref([]);

const cartStore = useCartStore();

onMounted(async () => {
  try {
    const res = await getProducts();
    products.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
});

watch(query, (newVal) => {
  if (newVal.length > 1) {
    filtered.value = products.value.filter((p) =>
      p.name.toLowerCase().includes(newVal.toLowerCase())
    );
  } else {
    filtered.value = [];
  }
});

const handleAddProduct = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price || 0,
    qty: 1,
  });
  Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: `${product.name} ditambahkan ke keranjang`,
    timer: 1500,
    showConfirmButton: false,
  });
  query.value = '';
  filtered.value = [];
};

const startListening = async () => {
  transcript.value = '';
  transcriptRef.value = '';
  filtered.value = [];
  audioChunksRef.value = [];

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    Swal.fire('Error', 'Browser tidak mendukung Web Speech API', 'error');
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognitionRef.value = recognition;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    let mimeType = '';
    if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
    else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
    else if (MediaRecorder.isTypeSupported('audio/mpeg')) mimeType = 'audio/mpeg';

    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.value = mediaRecorder;
    audioMimeType.value = mimeType || mediaRecorder.mimeType;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.value.push(e.data);
    };
    mediaRecorder.start();
  } catch (err) {
    Swal.fire('Error', 'Tidak dapat mengakses mikrofon', 'error');
    return;
  }

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    transcriptRef.value = text;
    transcript.value = text;
  };
  recognition.onerror = (e) => {
    console.error(e);
    Swal.fire('Error', 'Gagal menangkap suara', 'error');
    stopListening();
  };
  recognition.onend = () => {
    isListening.value = false;
    if (mediaRecorderRef.value && mediaRecorderRef.value.state === 'recording') {
      mediaRecorderRef.value.stop();
    }
    if (transcriptRef.value) {
      processTransaction(transcriptRef.value);
    } else {
      Swal.fire('Info', 'Tidak ada ucapan yang terekam', 'info');
    }
  };

  recognition.start();
  isListening.value = true;
};

const stopListening = () => {
  if (recognitionRef.value) recognitionRef.value.stop();
  if (mediaRecorderRef.value && mediaRecorderRef.value.state === 'recording') {
    mediaRecorderRef.value.stop();
  }
  isListening.value = false;
};

const processTransaction = async (spokenText) => {
  isProcessing.value = true;
  const jumlah = parseJumlah(spokenText) || 1;

  await new Promise((resolve) => setTimeout(resolve, 300));

  const mimeType = audioMimeType.value || 'audio/webm';
  const audioBlob = new Blob(audioChunksRef.value, { type: mimeType });

  let extension = 'webm';
  if (mimeType.includes('mp4')) extension = 'mp4';
  else if (mimeType.includes('mpeg')) extension = 'mp3';

  const formData = new FormData();
  formData.append('audio', audioBlob, `recording.${extension}`);
  formData.append('transcript', spokenText);
  formData.append('jumlah', String(jumlah));

  try {
    const res = await api.post('/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });

    const { produk, jumlah: qty, harga, produk_conf, matchedProduct } = res.data;

    if (matchedProduct) {
      const result = await Swal.fire({
        title: 'Tambahkan ke Keranjang?',
        html: `
        <strong>Produk:</strong> ${produk}<br/>
        <strong>Jumlah:</strong> ${qty}<br/>
        <small>Akurasi: ${(produk_conf * 100).toFixed(1)}%</small>
      `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Tambahkan',
        cancelButtonText: 'Batal',
      });

      if (result.isConfirmed) {
        cartStore.addItem({
          id: matchedProduct.id,
          name: matchedProduct.name,
          price: matchedProduct.price,
          qty: qty,
        });
        await Swal.fire('Berhasil!', 'Produk ditambahkan ke keranjang', 'success');
      }
    } else {
      let top3Text = '';
      if (res.data.produk_top3 && res.data.produk_top3.length) {
        top3Text = '<br/><br/><strong>Alternatif teratas:</strong><ul>';
        for (let [name, conf] of res.data.produk_top3) {
          top3Text += `<li>${name} (${(conf * 100).toFixed(1)}%)</li>`;
        }
        top3Text += '</ul>';
      }
      await Swal.fire({
        title: 'Hasil Deteksi Suara',
        html: `
        Produk terdeteksi: <strong>${produk}</strong><br/>
        Jumlah: ${qty}<br/>
        Perkiraan harga: Rp ${harga?.toLocaleString()}${top3Text}
      `,
        icon: 'info',
        confirmButtonText: 'OK',
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Gagal memproses suara. Coba lagi.', 'error');
  } finally {
    isProcessing.value = false;
  }
};
</script>

