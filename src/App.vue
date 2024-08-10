<script setup lang="ts">
import { Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/vue/20/solid';
import RaiderIO from './components/RaiderIO.vue';
import Alert from './components/Alert.vue';
import { ref } from 'vue';
import ModalSettings from './components/ModalSettings.vue';
import ModalInfo from './components/ModalInfo.vue';
import TeamReveal from './components/TeamReveal.vue';
import RosterList from './components/RosterList.vue';
import PlayerList from './components/PlayerList.vue';
import TeamList from './components/TeamList.vue';
import { useMembersStore } from './stores/members.store';
import { storeToRefs } from 'pinia';
import { useAlertStore } from './stores/alert.store';
import { useConfigStore } from './stores/config.store';
import { useTeamsStore } from './stores/teams.store';

const showInfo = ref(false);
const showSettings = ref(false);
const dragging = ref(false);

const configStore = useConfigStore();
const { region, realm, guild, minPlayers } = storeToRefs(configStore);

const members = useMembersStore();
const { selectedMembers } = storeToRefs(members);

const teamsStore = useTeamsStore();
const { teams, showTeam } = storeToRefs(teamsStore);

const alertStore = useAlertStore();
const { alert, fatal } = storeToRefs(alertStore);
</script>

<template>
  <div class="w-full h-full" @drop="dragging = false" @dragover.prevent @dragenter.prevent>
    <ModalInfo :show="showInfo" @close="showInfo = false" />
    <ModalSettings
      :show="showSettings || !region || !realm || !guild"
      :prevent-close="!region || !realm || !guild"
      @close="showSettings = false"
    />
    <TeamReveal v-if="showTeam" :team="showTeam" :number="teams.length + 1" />
    <Alert v-if="fatal" type="error" :fixed="true">
      {{ fatal }}
    </Alert>
    <Alert v-else-if="alert" :type="alert.type" :fixed="true" :timeout="4000">
      {{ alert.message }}
    </Alert>
    <Alert v-else-if="!region || !realm || !guild" :fixed="true" type="warning">
      Please select a region, realm and guild.
    </Alert>
    <Alert v-else-if="selectedMembers.length < minPlayers" :fixed="true" type="warning">
      Select {{ minPlayers - selectedMembers.length }} more players
    </Alert>
    <a href="https://raider.io" target="_blank" rel="noreferrer" class="underline"
      ><RaiderIO title="powered by" class="fixed bottom-1.5 right-1.5 h-6 z-10"
    /></a>
    <div class="flex items-center gap-2 absolute top-2 right-2">
      <QuestionMarkCircleIcon
        @click="showInfo = !showInfo"
        class="h-5 cursor-pointer"
        :class="{
          'text-gray-400 hover:text-gray-300': !showInfo,
          'text-raiderio': showInfo
        }"
      />
      <Cog6ToothIcon
        @click="showSettings = !showSettings"
        class="h-5 cursor-pointer"
        :class="{
          'text-gray-400 hover:text-gray-300': !showSettings,
          'text-raiderio': showSettings
        }"
      />
    </div>
    <div class="flex flex-col w-full pb-10 p-2">
      <div class="flex flex-col md:flex-row justify-start gap-4 w-full bg-[#353535]">
        <RosterList :dragging="dragging" @dragging="dragging = $event" />
        <PlayerList :dragging="dragging" />
        <TeamList />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
