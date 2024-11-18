<script setup lang="ts">
import { StarIcon, ArrowPathRoundedSquareIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { useMembersStore } from '../stores/members.store';
import Player from './Player.vue';
import Btn from './Btn.vue';
import ModalAddPlayer from './ModalAddPlayer.vue';
import PlayerListButtons from './PlayerListButtons.vue';
import { storeToRefs } from 'pinia';
import { useConfigStore } from '../stores/config.store';
import { useTeamsStore } from '../stores/teams.store';
import { ref } from 'vue';

defineProps<{
  dragging: boolean;
}>();

const showAddPlayer = ref(false);

const configStore = useConfigStore();
const { minPlayers } = storeToRefs(configStore);

const members = useMembersStore();
const { rolesText, selectedMembers, filteredMembers } = storeToRefs(members);

const teamsStore = useTeamsStore();
const { teams } = storeToRefs(teamsStore);

function onDrop(event: DragEvent) {
  const characterName = event.dataTransfer?.getData('characterName');
  const characterRealm = event.dataTransfer?.getData('characterRealm');
  const member = filteredMembers.value.find(
    (member) => member.character.name === characterName && member.character.realm === characterRealm
  );
  if (member) {
    members.add(member);
  } else {
    console.error('member not found', characterName);
  }
}
</script>

<template>
  <div
    class="flex flex-col order-1 md:order-2"
    @drop="onDrop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="flex justify-between">
      <div class="font-bold text-gray-400">Players</div>
      <Btn @click="showAddPlayer = true" class="font-bold hidden md:block"> ADD </Btn>
    </div>
    <div
      class="border border-dashed rounded-md h-[94px] w-full md:w-64 my-2 flex items-center justify-center text-sm font-bold transition-colors"
      :class="[dragging ? 'border-green-600 text-green-600' : 'border-gray-400 text-gray-400']"
    >
      Drag &amp; drop players here
    </div>
    <PlayerListButtons
      v-if="selectedMembers.length > 10"
      @add="showAddPlayer = true"
      @randomise="members.randomise()"
      @reset="members.reset()"
      :selected-members="selectedMembers"
      :min-players="minPlayers"
      :teams="teams"
    />
    <div
      class="flex justify-between hover:bg-[#454545] py-1 rounded-sm"
      :class="{ 'opacity-50': member.picked }"
      v-for="(member, index) in selectedMembers"
      :key="index"
    >
      <Player
        :title="member.character.active_spec_role"
        :character="member.character"
        :pug="member.pug"
      />
      <div class="flex items-center">
        <span title="Toggle team captain">
          <StarIcon
            @click="members.toggleCaptain(member)"
            class="h-5 cursor-pointer"
            :class="{
              'text-gray-400 hover:text-gray-300': !member.captain,
              'text-raiderio': member.captain
            }"
          />
        </span>
        <span title="Toggle spec">
          <ArrowPathRoundedSquareIcon
            @click="members.toggleSpec(member)"
            class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
          />
        </span>
        <span title="Remove">
          <XMarkIcon
            @click="members.remove(member)"
            class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
          />
        </span>
      </div>
    </div>
    <div class="flex gap-2 justify-between w-full">
      <div class="text-gray-400 font-bold">
        {{ rolesText }}
      </div>
    </div>
    <PlayerListButtons
      @add="showAddPlayer = true"
      @randomise="members.randomise()"
      @reset="members.reset()"
      :selected-members="selectedMembers"
      :min-players="minPlayers"
      :teams="teams"
    />
    <ModalAddPlayer
      :show="showAddPlayer"
      @close="showAddPlayer = false"
      @add="
        members.add({
          rank: 7,
          character: $event
        })
      "
    />
  </div>
</template>

<style scoped></style>
