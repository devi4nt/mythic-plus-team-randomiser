<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid';
import type { Member } from '../types';
import Loader from './Loader.vue';
// import RankFilter from "./RankFilter.vue";
import RoleFilter from './RoleFilter.vue';
import Player from './Player.vue';
import Alert from './Alert.vue';
import { useMembersStore } from '../stores/members.store';
import { storeToRefs } from 'pinia';

const emit = defineEmits<{
  (event: 'dragging', dragging: boolean): void;
}>();

defineProps<{
  dragging: boolean;
}>();

const members = useMembersStore();
const {
  role,
  // rank,
  filter,
  isFetching,
  selectedMembers,
  filteredMembers
} = storeToRefs(members);

function startDrag(event: DragEvent, member: Member) {
  if (event.dataTransfer) {
    // console.log(member);
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('characterName', member.character.name);
    emit('dragging', true);
  }
}

let lastTap: number;
let tapTimeout: number;
function handleTap(event: TouchEvent, member: Member) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  clearTimeout(tapTimeout);
  if (tapLength < 500 && tapLength > 0) {
    selectedMembers.value.push(member);
    event.preventDefault();
  } else {
    tapTimeout = setTimeout(() => {
      clearTimeout(tapTimeout);
    }, 500) as unknown as number;
  }
  lastTap = currentTime;
}
</script>

<template>
  <div class="flex flex-col order-3 md:order-1 gap-2">
    <div class="flex justify-between">
      <div class="font-bold text-gray-400">Roster</div>
      <Loader v-if="isFetching" />
    </div>
    <input
      v-model="filter"
      placeholder="Type to filter"
      class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1"
    />
    <!-- <RankFilter @update="rank = $event" :rank="rank" /> -->
    <RoleFilter @update="role = $event" :role="role" />
    <div class="w-full flex text-gray-400 text-sm">Double click to select players</div>
    <div class="grid grid-cols-2 md:grid-cols-1 gap-x-4" :class="{ 'opacity-40': isFetching }">
      <div
        class="flex justify-between hover:bg-[#454545] cursor-pointer py-1"
        v-for="member in filteredMembers"
        :key="member.character.name"
        :draggable="true"
        @dblclick="selectedMembers.push(member)"
        @touchstart="handleTap($event, member)"
        @dragstart="startDrag($event, member)"
      >
        <Player :character="member.character" />
        <span title="Add">
          <PlusIcon class="h-6 text-gray-400 hover:text-gray-300" />
        </span>
      </div>
    </div>
    <Alert type="warning" v-if="!filteredMembers.length"> No matching players </Alert>
  </div>
</template>

<style scoped></style>
