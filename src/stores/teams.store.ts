import type { Team } from '../types';
import { pause } from '../utils/time';
import { useSessionStorage } from '@vueuse/core';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useConfigStore } from './config.store';

export const useTeamsStore = defineStore('teams', () => {
  const configStore = useConfigStore();
  const { fancy } = storeToRefs(configStore);

  const showTeam = ref<Team>();
  const teams = useSessionStorage<Team[]>('teams', []);

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

  return {
    teams,
    showTeam,
    add,
    remove,
    reset
  };
});
