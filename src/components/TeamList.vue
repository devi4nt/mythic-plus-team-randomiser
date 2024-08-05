<script setup lang="ts">
import PlayerTeam from "./PlayerTeam.vue";
import { useMembersStore } from "@/stores/members.store";
import { useTeamsStore } from "@/stores/teams.store";
import { storeToRefs } from "pinia";

const members = useMembersStore();
const teamsStore = useTeamsStore();
const { teams } = storeToRefs(teamsStore);
</script>

<template>
  <div
    v-if="teams.length"
    class="flex flex-wrap h-max order-2 md:order-3 gap-2 gap-x-4 mt-8"
  >
    <div
      class="flex flex-col gap-2"
      v-for="(team, index) in teams"
      :key="team.id"
    >
      <PlayerTeam
        :members="team.members"
        :index="index"
        @remove="members.removeTeam(index)"
      />
    </div>
  </div>
</template>

<style scoped></style>
