<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid';
import { useTimeoutFn } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';

type AlertType = 'info' | 'error' | 'warning' | 'success';
type AlertClasses = Record<'bg' | 'icon' | 'body', string>;

const props = defineProps<{
  type: AlertType;
  timeout?: number;
  fixed?: boolean;
}>();

const visible = ref(true);
const classes = ref<Record<AlertType, AlertClasses>>({
  info: {
    bg: 'bg-blue-600',
    icon: 'text-blue-100',
    body: 'text-blue-50'
  },
  warning: {
    bg: 'bg-yellow-600',
    icon: 'text-yellow-100',
    body: 'text-yellow-50'
  },
  error: {
    bg: 'bg-red-600',
    icon: 'text-red-100',
    body: 'text-red-50'
  },
  success: {
    bg: 'bg-green-600',
    icon: 'text-green-100',
    body: 'text-green-50'
  }
});

const colours = computed<AlertClasses>(() => {
  return classes.value[props.type];
});

onMounted(() => {
  if (props.timeout) {
    useTimeoutFn(() => {
      visible.value = false;
    }, props.timeout);
  }
});
</script>

<template>
  <div
    class="transition-opacity ease-in-out duration-500"
    :class="[
      visible ? 'opacity-100' : 'opacity-0',
      fixed ? 'fixed bottom-0 w-full z-10' : '',
      colours.bg
    ]"
  >
    <div class="p-2">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5" :class="colours.icon" aria-hidden="true" />
        </div>
        <div class="ml-1">
          <p class="text-sm font-bold" :class="colours.body">
            <slot />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
