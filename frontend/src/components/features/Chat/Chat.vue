<template>
  <div>
    <!-- Chat Modal Window -->
    <div
      v-if="isOpen"
      class="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-96 md:w-[28rem] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
    >
      <!-- Header -->
      <div class="bg-sky-950 px-4 py-3 flex justify-between items-center text-white">
        <span class="font-bold text-sm tracking-wide flex items-center gap-2">
          FinSense AI Support
        </span>
        <button
          @click="toggleChat"
          class="hover:bg-sky-800 p-1 rounded-full transition cursor-pointer"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 text-sm min-h-[300px] max-h-[calc(80vh-130px)]">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'p-3 max-w-[85%] shadow-sm break-words',
            msg.sender === 'user'
              ? 'self-end bg-sky-950 text-white rounded-t-xl rounded-bl-xl rounded-br-xl'
              : 'self-start bg-gray-200 text-sky-950 rounded-tr-xl rounded-br-xl rounded-bl-xl'
          ]"
        >
          <span v-html="msg.text"></span>
        </div>
        <div v-if="isLoading" class="self-start bg-gray-200 text-sky-950 p-3 rounded-xl">
          Mengetik...
        </div>
        <div ref="messagesEndRef"></div>
      </div>

      <!-- Quick Replies -->
      <div v-if="quickReplies.length > 0" class="px-3 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-2">
        <button
          v-for="(reply, idx) in quickReplies"
          :key="idx"
          @click="handleQuickReply(reply.label)"
          class="bg-gray-100 hover:bg-gray-200 text-sky-950 text-xs py-1.5 px-3 rounded-full transition cursor-pointer"
        >
          {{ reply.label }}
        </button>
      </div>

      <!-- Input Box -->
      <div class="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
        <input
          type="text"
          v-model="inputValue"
          @keydown.enter="onSendEventHandler"
          placeholder="Ketik pesan..."
          :disabled="isLoading"
          class="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-sky-950 text-sm"
        />
        <button
          @click="onSendEventHandler"
          :disabled="isLoading"
          class="bg-sky-950 text-white p-2 rounded-full hover:bg-sky-800 transition disabled:opacity-50 cursor-pointer"
        >
          <Send :size="18" />
        </button>
      </div>
    </div>

    <!-- Floating Button -->
    <button
      @click="toggleChat"
      :class="[
        'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-3 rounded-full shadow-xl transition-all duration-300 z-50 flex items-center justify-center cursor-pointer',
        isOpen
          ? 'bg-red-500 hover:bg-red-600 rotate-90 scale-90 md:hidden text-white'
          : 'bg-sky-950 hover:bg-sky-800 hover:-translate-y-1 text-white'
      ]"
    >
      <X v-if="isOpen" :size="24" />
      <MessageSquare v-else :size="24" />
    </button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import api from '@/services/api';
import { X, Send, MessageSquare } from 'lucide-vue-next';

const isOpen = ref(false);
const messages = ref([]);
const inputValue = ref('');
const sessionId = ref(null);
const quickReplies = ref([]);
const isLoading = ref(false);
const messagesEndRef = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
  });
};

watch(messages, scrollToBottom, { deep: true });

const createNewSession = async () => {
  try {
    const response = await api.post('/chat/sessions', {
      session_title: 'Chat baru',
    });
    sessionId.value = response.data.id;
    messages.value = [
      {
        id: Date.now(),
        sender: 'ai',
        text: 'Halo! Saya asisten FinSense. Pilih topik yang ingin kamu tanyakan:',
      },
    ];
    quickReplies.value = [
      { id: 'catat', label: '🎤 Catat Transaksi (Suara)' },
      { id: 'lihat_transaksi', label: '📋 Lihat Transaksi' },
      { id: 'stok', label: '📦 Manajemen Stok' },
      { id: 'hutang', label: '💰 Hutang/Piutang' },
      { id: 'tips', label: '💡 Tips UMKM' },
    ];
  } catch (error) {
    console.error('Gagal membuat session chat:', error);
  }
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && !sessionId.value) {
    createNewSession();
  }
};

const sendMessageToBackend = async (messageText) => {
  if (!sessionId.value) return;
  isLoading.value = true;
  try {
    const response = await api.post(`/chat/sessions/${sessionId.value}/messages`, {
      message: messageText,
    });
    const assistantMsg = response.data.assistantMessage;
    messages.value.push({
      id: assistantMsg.id,
      sender: 'ai',
      text: assistantMsg.content,
    });
    quickReplies.value = response.data.quickReplies || [];
  } catch (error) {
    console.error('Gagal mengirim pesan:', error);
    messages.value.push({
      id: Date.now() + 999,
      sender: 'ai',
      text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
    });
  } finally {
    isLoading.value = false;
  }
};

const onSendEventHandler = async () => {
  if (inputValue.value.trim() === '' || isLoading.value) return;
  const userMessageText = inputValue.value.trim();
  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text: userMessageText,
  });
  inputValue.value = '';
  quickReplies.value = [];
  await sendMessageToBackend(userMessageText);
};

const handleQuickReply = (label) => {
  inputValue.value = label;
  onSendEventHandler();
};
</script>

