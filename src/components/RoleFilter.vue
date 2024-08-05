<script setup lang="ts">
import { ref } from 'vue';
import type { ClassFilter } from '../types';
import Btn from './Btn.vue';

const emit = defineEmits<{
  (event: 'update', role: ClassFilter): void;
}>();

defineProps<{
  role: ClassFilter;
}>();

const roles = ref<ClassFilter[]>(['ALL', 'TANK', 'DPS', 'HEALING']);
</script>

<template>
  <div class="flex justify-between gap-1">
    <Btn
      v-for="r in roles"
      :key="r"
      @click="role !== r ? emit('update', r) : null"
      :type="role === r ? 'success' : 'default'"
      class="w-full"
    >
      {{ r === 'HEALING' ? 'HEALER' : r }}
    </Btn>
  </div>
</template>

<style scoped></style>
