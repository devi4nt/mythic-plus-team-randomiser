<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Member } from "@/types";
import Player from "./Player.vue";

defineProps<{
  index: number;
  members: Member[];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="font-bold text-gray-400">Team {{ index + 1 }}</div>
    <Player
      v-for="member in members"
      :key="member.character.name"
      :character="member.character"
    />
  </div>
</template>

<style scoped></style>
