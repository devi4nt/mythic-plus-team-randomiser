<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Member } from '../types';
import Player from './Player.vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';

const emit = defineEmits<{
  (event: 'remove'): void;
  (event: 'swap', swapName?: string, target?: Member): void;
}>();

defineProps<{
  index: number;
  members: Member[];
  swappable?: boolean;
}>();

function startDrag(event: DragEvent, member: Member) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('characterName', member.character.name);
  }
}

function onDrop(event: DragEvent, target: Member) {
  emit('swap', event.dataTransfer?.getData('characterName'), target);
}
</script>

<template>
  <div class="flex flex-col gap-1 min-w-[180px] bg-[#494949] p-2 rounded-md drop-shadow-md">
    <div class="flex justify-between">
      <div class="font-bold text-gray-400">Team {{ index + 1 }}</div>
      <span title="Remove">
        <XMarkIcon
          @click="emit('remove')"
          class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
        />
      </span>
    </div>
    <Player
      v-for="(member, index) in members"
      :key="index"
      :character="member.character"
      :pug="member.pug"
      :draggable="swappable"
      @dragstart="startDrag($event, member)"
      @drop="onDrop($event, member)"
      @dragover.prevent
      @dragenter.prevent
    />
  </div>
</template>

<style scoped></style>
