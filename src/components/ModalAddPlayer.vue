<script setup lang="ts">
import { computed, ref } from 'vue';
import Modal from './Modal.vue';
import Btn from './Btn.vue';
import Loader from './Loader.vue';
import Alert from './Alert.vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { regions, realms } from '../data/realms';
import type { Character, Region } from '../types';
import { useFetch, useSessionStorage, onKeyStroke } from '@vueuse/core';

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'add', character: Character): void;
}>();

defineProps<{
  show: boolean;
  preventClose?: boolean;
}>();

const region = useSessionStorage<Region>('add.region', 'EU');
const realm = useSessionStorage('add.realm', '');
const character = useSessionStorage('add.character', '');

const regionsSorted = computed(() => regions.sort((a, b) => a.label.localeCompare(b.label)));

const regionRealms = computed(() =>
  (realms[region.value] ?? []).sort((a, b) => a.label.localeCompare(b.label))
);

const error = ref('');
const loading = ref(false);
async function add() {
  if (!region.value || !realm.value || !character.value) {
    error.value = 'Please select a region, realm and character name.';
    return;
  }
  error.value = '';
  loading.value = true;
  // https://raider.io/api#/guild/getApiV1CharactersProfile
  const { data, statusCode } = await useFetch(
    `https://raider.io/api/v1/characters/profile?region=${region.value.toLowerCase()}&realm=${
      realm.value
    }&name=${encodeURIComponent(character.value)}&fields=members`
  ).json<Character>();
  loading.value = false;
  if (statusCode.value === 200 && data.value) {
    emit('add', data.value);
    close();
  } else {
    error.value = 'Character not found, please check realm and character name.';
  }
}

const close = () => {
  error.value = '';
  character.value = '';
  emit('close');
};

const trigger = ref<HTMLInputElement>();
onKeyStroke('Enter', add, { target: trigger });
</script>

<template>
  <Modal :show="show" @close="close">
    <div class="bg-[#494949] rounded-lg p-4">
      <div class="flex justify-between">
        <div class="text-left text-2xl text-gray-400 font-bold">Add Player</div>
        <XMarkIcon
          v-if="!preventClose"
          @click="close"
          class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
        />
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <div class="text-left text-gray-400 text-sm font-bold">
          Select region, realm & the character's name.
        </div>
        <Alert v-if="error" type="error">
          {{ error }}
        </Alert>
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400">Region</div>
          <select
            v-model="region"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          >
            <option value="">Select a region</option>
            <option v-for="region in regionsSorted" :key="region.value" :value="region.value">
              {{ region.label }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400">Realm</div>
          <select
            v-model="realm"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          >
            <option value="">Select a realm</option>
            <option v-for="realm in regionRealms" :key="realm.value" :value="realm.value">
              {{ realm.label }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400">Character</div>
          <input
            ref="trigger"
            v-model="character"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
            placeholder="Enter the character name"
          />
        </div>
      </div>
      <div class="flex justify-between mt-4">
        <div class="text-left text-gray-400 text-sm">
          <a
            href="https://github.com/devi4nt/mythic-plus-team-randomiser/issues"
            target="_blank"
            rel="noreferrer"
            class="text-raiderio underline"
            >Can't find a player?</a
          >
        </div>
        <div class="flex gap-2">
          <Loader v-if="loading" />
          <Btn class="font-bold" @click="add()"> ADD </Btn>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
