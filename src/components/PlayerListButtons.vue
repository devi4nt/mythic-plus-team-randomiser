<script setup lang="ts">
import { BoltIcon } from '@heroicons/vue/20/solid';
import type { Member, Team } from '../types';
import Btn from './Btn.vue';

const emit = defineEmits(['add', 'randomise', 'reset']);

defineProps<{
  selectedMembers: Member[];
  minPlayers: number;
  teams: Team[];
}>();
</script>

<template>
  <div class="flex justify-between gap-2 my-2">
    <div class="flex gap-2">
      <Btn @click="emit('add')" class="font-bold block md:hidden"> ADD </Btn>
      <Btn
        :disabled="!selectedMembers.length && !teams.length"
        @click="emit('reset')"
        class="font-bold"
      >
        RESET
      </Btn>
    </div>
    <Btn
      :disabled="selectedMembers.length < minPlayers"
      :type="selectedMembers.length < minPlayers ? 'default' : 'success'"
      @click="$emit('randomise')"
      class="font-bold"
    >
      <BoltIcon class="w-3 h-3" /> PICK TEAMS
    </Btn>
  </div>
</template>

<style scoped></style>
