<script setup lang="ts">
import { characterClass, characterSpecClass, characterTextClass } from '../utils/classes';
import type { Character, ClassRole } from '../types';
import { computed } from 'vue';

const props = defineProps<{
  character: Character;
  pug?: boolean;
}>();

const specClass = computed(() => characterSpecClass(props.character));
const classClass = computed(() => characterClass(props.character));
const textClass = computed(() => characterTextClass(props.character));

const roles: Record<ClassRole, string> = {
  DPS: 'Damage dealer',
  TANK: 'Tank',
  HEALING: 'Healer'
};
const roleText = computed(() => roles[props.character.active_spec_role]);
</script>

<template>
  <div class="flex items-center gap-1 h-6" :class="{ pug: pug }">
    <div class="w-[22px] scaler -ml-1">
      <div :class="classClass" :title="pug ? 'Pug' : character.class"></div>
    </div>
    <div class="w-[22px] scaler mr-2">
      <div :class="specClass" :title="pug ? 'Pug' : character.active_spec_name"></div>
    </div>
    <div class="font-bold" :class="pug ? 'text-gray-400' : textClass">
      {{ pug ? roleText : character.name }}
    </div>
  </div>
</template>

<style scoped>
.scaler {
  transform: scale(0.34);
}
.pug .scaler div {
  background-image: none;
  background-color: rgb(97, 101, 109);
}
</style>
