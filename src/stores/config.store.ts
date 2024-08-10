import type { Region } from '../types';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const minPlayers = ref(6);
  const region = useLocalStorage<Region>('region', 'EU');
  const realm = useLocalStorage<string>('realm', '');
  const guild = useLocalStorage<string>('guild', '');
  const fancy = useLocalStorage<boolean>('fancy', true);
  const autoPug = useLocalStorage<boolean>('autoPug', false);
  const spreadLust = useLocalStorage<boolean>('spreadLust', true);

  return {
    region,
    realm,
    guild,
    fancy,
    autoPug,
    spreadLust,
    minPlayers
  };
});
