<script setup lang="ts">
import { computed, ref } from "vue";
import Modal from "./Modal.vue";
import Btn from "./Btn.vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";
import { regions, realms } from "@/data/realms";
import type { Region } from "@/types";

const emit = defineEmits<{
  (event: "close"): void;
  (
    event: "update",
    data: { region: Region; realm: string; guild: string }
  ): void;
}>();

const props = defineProps<{
  show: boolean;
  region: Region;
  realm: string;
  guild: string;
  preventClose?: boolean;
}>();

const regionName = ref(props.region);
const realmName = ref(props.realm);
const guildName = ref(props.guild);

const regionsSorted = computed(() =>
  regions.sort((a, b) => a.label.localeCompare(b.label))
);

const regionRealms = computed(() =>
  (realms[regionName.value] ?? []).sort((a, b) =>
    a.label.localeCompare(b.label)
  )
);

function update() {
  emit("update", {
    region: regionName.value,
    realm: realmName.value,
    guild: guildName.value,
  });
  emit("close");
}
</script>

<template>
  <Modal :show="show" @close="emit('close')">
    <div class="bg-[#494949] rounded-lg p-4">
      <div class="flex justify-between">
        <div class="text-left text-2xl text-gray-400 font-bold">
          Select realm & guild
        </div>
        <XMarkIcon
          v-if="!preventClose"
          @click="emit('close')"
          class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
        />
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400 font-bold">
            Region
          </div>
          <select
            v-model="regionName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          >
            <option
              v-for="region in regionsSorted"
              :key="region.value"
              :value="region.value"
            >
              {{ region.label }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400 font-bold">
            Realm
          </div>
          <select
            v-model="realmName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          >
            <option
              v-for="realm in regionRealms"
              :key="realm.value"
              :value="realm.value"
            >
              {{ realm.label }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <div class="md:w-64 w-full text-left text-gray-400 font-bold">
            Guild
          </div>
          <input
            v-model="guildName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <Btn class="font-bold" @click="update()"> SAVE </Btn>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
