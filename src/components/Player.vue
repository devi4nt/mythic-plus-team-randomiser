<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Character } from "@/types";
import { computed } from "vue";

const props = defineProps<{
  character: Character;
}>();

const safeClass = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-");
};
const specClass = computed(
  () =>
    "spec_" +
    safeClass(props.character.class) +
    "_" +
    safeClass(props.character.active_spec_name)
);
const classClass = computed(() => "class_" + safeClass(props.character.class));

const textClass = computed(
  () => "class-color--" + safeClass(props.character.class)
);
</script>

<template>
  <div class="flex items-center gap-1 h-6">
    <div class="w-[22px] scaler -ml-1">
      <div :class="classClass"></div>
    </div>
    <div class="w-[22px] scaler mr-2"><div :class="specClass"></div></div>
    <div class="font-bold" :class="textClass">
      {{ character.name }}
    </div>
  </div>
</template>

<style scoped>
.scaler {
  transform: scale(0.34);
}
</style>
