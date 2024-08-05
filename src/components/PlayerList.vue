<script setup lang="ts">
import {
  StarIcon,
  ArrowPathRoundedSquareIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import { useMembersStore } from "@/stores/members.store";
import Player from "./Player.vue";
import Btn from "./Btn.vue";
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/config.store";
import { useTeamsStore } from "@/stores/teams.store";

defineProps<{
  dragging: boolean;
}>();

const configStore = useConfigStore();
const { autoPug, minPlayers } = storeToRefs(configStore);

const members = useMembersStore();
const { rolesText, selectedMembers, filteredMembers } = storeToRefs(members);

const teamsStore = useTeamsStore();
const { teams } = storeToRefs(teamsStore);

function onDrop(event: DragEvent) {
  const characterName = event.dataTransfer?.getData("characterName");
  // console.log("onDrop", event, characterName);
  const member = filteredMembers.value.find(
    (member) => member.character.name === characterName
  );
  if (member) {
    selectedMembers.value.push(member);
  } else {
    console.error("member not found", characterName);
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
    <div class="font-bold text-gray-400">Players</div>
    <div
      class="border border-dashed rounded-md h-[94px] w-full md:w-64 my-2 flex items-center justify-center text-sm font-bold transition-colors"
      :class="[
        dragging
          ? 'border-green-600 text-green-600'
          : 'border-gray-400 text-gray-400',
      ]"
    >
      Drag &amp; drop players here
    </div>
    <div
      class="flex justify-between py-1"
      v-for="member in selectedMembers"
      :key="member.character.name"
    >
      <Player :character="member.character" :pug="member.pug" />
      <div class="flex items-center">
        <span title="Toggle team captain">
          <StarIcon
            @click="members.toggleCaptain(member)"
            class="h-5 cursor-pointer"
            :class="{
              'text-gray-400 hover:text-gray-300': !member.captain,
              'text-raiderio': member.captain,
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
    <div class="flex justify-between gap-2 mt-2">
      <Btn
        :disabled="selectedMembers.length < minPlayers"
        @click="members.randomise()"
        class="font-bold"
      >
        PICK TEAMS
      </Btn>
      <div class="flex gap-2">
        <Btn v-if="!autoPug" @click="members.addPug()" class="font-bold">
          PUG
        </Btn>
        <Btn
          :disabled="!selectedMembers.length && !teams.length"
          @click="members.reset()"
          class="font-bold"
        >
          RESET
        </Btn>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
