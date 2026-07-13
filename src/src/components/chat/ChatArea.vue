<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChatClient from '@/services/chat/ChatClient';
import { getRoomInfo } from '@/services/chat/room';

const message = ref<string>('');
const messages = ref<any[]>([]);

const room = ref<string>('');
const rooms = ref<string[]>([]);

let chatClient: ChatClient | null = null;

/** 送信処理 */
const handleSubmit = async (e: Event) => {
  e.preventDefault();

  chatClient!.sendMessage(message.value);
  message.value = '';
};

// 初期化時
onMounted(async () => {
  console.log('mounted');

  const params = new URLSearchParams(window.location.search);

  const info = getRoomInfo(params);

  rooms.value = info.rooms;
  room.value = info.room;

  chatClient = new ChatClient(info.room, (data) => {
    messages.value = [data.message, ...messages.value];
  });
});
</script>

<template>
  <div class="space-y-5">
    <div class="space-x-2 min-h-6">
      <span v-for="val in rooms">
        <span v-if="room === val">{{ val }}</span>
        <a v-else :href="`/chat?room=${val}`" class="app-link-normal">{{
          val
        }}</a>
      </span>
    </div>

    <form @submit="handleSubmit" class="space-y-4">
      <div>内容</div>
      <textarea v-model="message" class="app-form-input"></textarea>
      <button type="submit" class="app-btn-primary">送信</button>
    </form>

    <div
      class="border border-gray-700 p-2 mb-2 h-80 mt-5 overflow-y-auto space-y-2"
    >
      <div v-for="msg in messages" :key="msg">
        <div>{{ msg }}</div>
      </div>
    </div>
  </div>
</template>
