import type { Member, Team } from '../types';
import { pause } from '../utils/time';
import { useSessionStorage } from '@vueuse/core';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useConfigStore } from './config.store';

export const useTeamsStore = defineStore('teams', () => {
  const configStore = useConfigStore();
  const { fancy } = storeToRefs(configStore);

  const showTeam = ref<Team>();
  const teams = useSessionStorage<Team[]>('teams', []);

  const amount = computed(() => teams.value.length);

  function reset() {
    teams.value.length = 0;
  }

  async function add(team: Team) {
    if (fancy.value) {
      showTeam.value = team;
      await pause(5000);
      showTeam.value = undefined;
    }
    teams.value.push(team);
  }

  function remove(index: number) {
    const [team] = teams.value.splice(index, 1);
    return team;
  }

  function swap(sourceTeam?: Team, source?: Member, destination?: Member) {
    if (!sourceTeam || !source || !destination || sourceTeam.members.includes(destination)) {
      console.error('error swapping members', { sourceTeam, source, destination });
      return;
    }
    // prevent swapping of members with different roles
    if (source.character.active_spec_role !== destination.character.active_spec_role) {
      return;
    }
    const destinationTeam = teams.value.find((team) =>
      team.members.find((member) => member === destination)
    );
    if (!destinationTeam) {
      return;
    }
    destinationTeam.members[destinationTeam.members.indexOf(destination)] = source;
    sourceTeam.members[sourceTeam.members.indexOf(source)] = destination;
  }

  return {
    teams,
    amount,
    showTeam,
    add,
    remove,
    reset,
    swap
  };
});
