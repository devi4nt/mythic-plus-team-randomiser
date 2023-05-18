<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Member } from "@/types";
import Player from "./Player.vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";

const emit = defineEmits(["remove"]);
defineProps<{
  index: number;
  members: Member[];
}>();
</script>

<template>
  <div
    class="flex flex-col gap-1 min-w-[180px] bg-[#494949] p-2 rounded-md drop-shadow-md"
  >
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
      v-for="member in members"
      :key="member.character.name"
      :character="member.character"
      :pug="member.pug"
    />
  </div>
</template>

<style scoped></style>
