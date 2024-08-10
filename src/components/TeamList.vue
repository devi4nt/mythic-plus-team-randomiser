<script setup lang="ts">
import { ShareIcon } from '@heroicons/vue/20/solid';
import PlayerTeam from './PlayerTeam.vue';
import Btn from './Btn.vue';
import { useMembersStore } from '../stores/members.store';
import { useTeamsStore } from '../stores/teams.store';
import { storeToRefs } from 'pinia';
import type { IShareData, Member } from '../types';
import { compressToEncodedURIComponent } from 'lz-string';
import { useConfigStore } from '../stores/config.store';
import { useClipboard } from '@vueuse/core';
import { useAlertStore } from '../stores/alert.store';

const { copy, isSupported } = useClipboard();

const members = useMembersStore();
const { selectedMembers } = storeToRefs(members);

const alert = useAlertStore();
const { success, error } = storeToRefs(alert);

const teamsStore = useTeamsStore();
const { teams } = storeToRefs(teamsStore);

const config = useConfigStore();
const { region, realm, guild } = storeToRefs(config);

function swap(swapName?: string, destination?: Member) {
  const team = teams.value.find((team) =>
    team.members.find((member) => member.character.name === swapName)
  );
  const source = team?.members.find((member) => member.character.name === swapName);
  teamsStore.swap(team, source, destination);
}

function share() {
  const teamMembers = teams.value.map((team) => team.members).flat();
  const unselected: Member[] = selectedMembers.value
    .filter((member) => !teamMembers.includes(member))
    .map((member) => ({
      rank: member.rank,
      character: {
        name: member.character.name,
        class: member.character.class,
        active_spec_name: member.character.active_spec_name,
        active_spec_role: member.character.active_spec_role
      }
    }));
  const data: IShareData = {
    config: {
      version: 1,
      region: region.value,
      realm: realm.value,
      guild: guild.value
    },
    teams: teams.value.map((team) => ({
      id: team.id,
      members: team.members.map((member) => ({
        rank: member.rank,
        character: {
          name: member.character.name,
          class: member.character.class,
          active_spec_name: member.character.active_spec_name,
          active_spec_role: member.character.active_spec_role
        }
      }))
    })),
    unselected
  };
  const uncompressed = JSON.stringify(data);
  const compressed = compressToEncodedURIComponent(uncompressed);
  if (isSupported) {
    copy(`${window.location.origin}?share=${compressed}`);
    success.value = 'Copied share link to clipboard';
  } else {
    error.value = 'Your browser does not support copying to clipboard';
  }
}
</script>

<template>
  <div v-if="teams.length" class="order-2 md:order-3 mt-0 md:mt-8">
    <div class="flex flex-wrap h-max gap-2 gap-x-4">
      <div class="flex flex-col gap-2" v-for="(team, index) in teams" :key="team.id">
        <PlayerTeam
          :members="team.members"
          :index="index"
          @remove="members.removeTeam(index)"
          @swap="swap"
          :swappable="true"
        />
      </div>
    </div>
    <Btn @click="share" class="mt-2" title="Copy share link">
      <ShareIcon class="w-3 h-3" />SHARE TEAMS
    </Btn>
  </div>
</template>

<style scoped></style>
