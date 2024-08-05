<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue';

withDefaults(
  defineProps<{
    disabled?: boolean;
    type?: 'default' | 'error' | 'warning' | 'success' | 'info';
  }>(),
  { type: 'default' }
);

const classes = ref({
  default: 'bg-white/10 hover:bg-white/20 text-white',
  info: 'bg-blue-600 hover:bg-blue-600 text-blue-900',
  warning: 'bg-yellow-600 hover:bg-yellow-600 text-yellow-900',
  error: 'bg-red-600 hover:bg-red-600 text-red-900',
  success: 'bg-green-600 hover:bg-green-600 text-green-900'
});
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="rounded px-2 py-1 text-xs font-semibold shadow-sm"
    :class="[disabled ? 'opacity-75 cursor-not-allowed' : '', classes[type]]"
  >
    <slot />
  </button>
</template>

<style scoped></style>
