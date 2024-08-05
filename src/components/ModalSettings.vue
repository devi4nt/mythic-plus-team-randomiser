<script setup lang="ts">
import { computed, ref } from 'vue';
import Modal from './Modal.vue';
import Btn from './Btn.vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { regions, realms } from '../data/realms';
import type { Region } from '../types';

const emit = defineEmits<{
  (event: 'close'): void;
  (
    event: 'update',
    data: {
      region: Region;
      realm: string;
      guild: string;
      autoPug: boolean;
      fancy: boolean;
    }
  ): void;
}>();

const props = defineProps<{
  show: boolean;
  region: Region;
  realm: string;
  guild: string;
  autoPug: boolean;
  fancy: boolean;
  preventClose?: boolean;
}>();

const regionName = ref(props.region);
const realmName = ref(props.realm);
const guildName = ref(props.guild);
const autoPug = ref(props.autoPug);
const fancy = ref(props.fancy);

const regionsSorted = computed(() => regions.sort((a, b) => a.label.localeCompare(b.label)));

const regionRealms = computed(() =>
  (realms[regionName.value] ?? []).sort((a, b) => a.label.localeCompare(b.label))
);

function update() {
  emit('update', {
    region: regionName.value,
    realm: realmName.value,
    guild: guildName.value,
    autoPug: autoPug.value,
    fancy: fancy.value
  });
  emit('close');
}
</script>

<template>
  <Modal :show="show" @close="emit('close')">
    <div class="bg-[#494949] rounded-lg p-4">
      <div class="flex justify-between">
        <div class="text-left text-2xl text-gray-400 font-bold">
          Mythic+ Team Randomiser Settings
        </div>
        <XMarkIcon
          v-if="!preventClose"
          @click="emit('close')"
          class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
        />
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <div class="text-left text-gray-400 text-sm font-bold">
          Select region, realm & enter your guilds name
        </div>
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400">Region</div>
          <select
            v-model="regionName"
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
            v-model="realmName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          >
            <option value="">Select a realm</option>
            <option v-for="realm in regionRealms" :key="realm.value" :value="realm.value">
              {{ realm.label }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400">Guild</div>
          <input
            v-model="guildName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
            placeholder="Enter your guild name"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <div class="text-left text-gray-400 text-sm font-bold">Other settings</div>
        <div class="flex items-center gap-2">
          <div class="w-full text-left text-gray-400">
            Automatically add pugs if there aren't enough real players
          </div>
          <input v-model="autoPug" type="checkbox" />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-full text-left text-gray-400">Animated team reveal</div>
          <input v-model="fancy" type="checkbox" />
        </div>
      </div>
      <div class="flex justify-between mt-4">
        <div class="text-left text-gray-400 text-sm">
          <a
            href="mailto:mythic+randomiser@merry.earth?subject=I%20can&#39;t%20find%20my%20region%20or%20realm"
            class="text-raiderio underline"
            >Can't find your region or realm?</a
          >
        </div>
        <Btn class="font-bold" @click="update()"> SAVE </Btn>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
