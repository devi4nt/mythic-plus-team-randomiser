<script setup lang="ts">
import { ref } from "vue";
import Modal from "./Modal.vue";
import Btn from "./Btn.vue";

import { XMarkIcon } from "@heroicons/vue/20/solid";

const emit = defineEmits<{
  (event: "close"): void;
  (
    event: "update",
    data: { region: string; realm: string; guild: string }
  ): void;
}>();

const props = defineProps<{
  show: boolean;
  region: string;
  realm: string;
  guild: string;
}>();

const regionName = ref(props.region);
const realmName = ref(props.realm);
const guildName = ref(props.guild);

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
        <div class="w-28 text-left text-2xl text-gray-400 font-bold">
          Settings
        </div>
        <XMarkIcon
          @click="emit('close')"
          class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
        />
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <!-- <div class="flex items-center gap-2">
          <div class="w-28 text-left text-gray-400 font-bold">Region</div>
          <select
            v-model="regionName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          >
            <option value="eu">Europe</option>
          </select>
        </div> -->
        <div class="flex items-center gap-2">
          <div class="w-28 text-left text-gray-400 font-bold">Realm</div>
          <select
            v-model="realmName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          >
            <option value="connected-quel-thalas">Quel'Thalas</option>
            <option value="connected-azjol-nerub">Azjol-Nerub</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-28 text-left text-gray-400 font-bold">Guild</div>
          <input
            v-model="guildName"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1 w-full"
          />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <Btn class="font-bold" @click="update()"> UPDATE </Btn>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
