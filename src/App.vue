<script setup lang="ts">
import { Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/vue/20/solid';
import RaiderIO from './components/RaiderIO.vue';
import Alert from './components/Alert.vue';
import { onMounted, ref } from 'vue';
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
import { decompressFromEncodedURIComponent } from 'lz-string';
import type { IShareData, Region } from './types';
import { regions } from './data/realms';

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

const initialised = ref(false);
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const compressedData = params.get('share');
  if (compressedData) {
    try {
      selectedMembers.value.length = 0;

      const data: IShareData = JSON.parse(decompressFromEncodedURIComponent(compressedData));
      if (data && data.config?.version === 1) {
        region.value = data.config?.region;
        realm.value = data.config?.realm;
        guild.value = data.config?.guild;
      }
      if (data && data.teams) {
        selectedMembers.value.push(...data.teams.map((team) => team.members).flat());
        teams.value = data.teams;
      }
      if (data && data.unselected) {
        selectedMembers.value.push(...data.unselected);
      }
    } catch (e) {
      console.error('unable to parse share data', e);
    }
  } else {
    const setRegion = params.get('region')?.toUpperCase() as Region;
    if (regions.find((r) => r.value === setRegion)) {
      region.value = setRegion;
    }
    if (params.get('realm')) {
      realm.value = params.get('realm');
    }
    if (params.get('guild')) {
      guild.value = params.get('guild');
    }
  }
  initialised.value = true;
});
</script>

<template>
  <div
    v-if="initialised"
    class="w-full h-full"
    @drop="dragging = false"
    @dragover.prevent
    @dragenter.prevent
  >
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
      <div title="About this app">
        <QuestionMarkCircleIcon
          @click="showInfo = !showInfo"
          class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
          :class="{
            'text-gray-400 hover:text-gray-300': !showInfo,
            'text-raiderio': showInfo
          }"
        />
      </div>
      <div title="Settings">
        <Cog6ToothIcon
          @click="showSettings = !showSettings"
          class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
          :class="{
            'text-gray-400 hover:text-gray-300': !showSettings,
            'text-raiderio': showSettings
          }"
        />
      </div>
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
