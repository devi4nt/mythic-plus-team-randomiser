<script setup lang="ts">
import type { Member, Team } from '../types';
import Btn from './Btn.vue';

const emit = defineEmits(['add', 'randomise', 'addPug', 'reset']);

defineProps<{
  autoPug: boolean;
  selectedMembers: Member[];
  minPlayers: number;
  teams: Team[];
}>();
</script>

<template>
  <div class="flex justify-between gap-2 my-2">
    <Btn
      :disabled="selectedMembers.length < minPlayers"
      @click="$emit('randomise')"
      class="font-bold"
    >
      PICK TEAMS
    </Btn>
    <div class="flex gap-2">
      <Btn @click="emit('add')" class="font-bold block md:hidden"> ADD </Btn>
      <Btn v-if="!autoPug" @click="emit('addPug')" class="font-bold"> PUG </Btn>
      <Btn
        :disabled="!selectedMembers.length && !teams.length"
        @click="emit('reset')"
        class="font-bold"
      >
        RESET
      </Btn>
    </div>
  </div>
</template>

<style scoped></style>
