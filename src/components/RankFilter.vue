<script setup lang="ts">
import { ref } from "vue";
import Btn from "./Btn.vue";

const emit = defineEmits<{
  (event: "update", rank: number): void;
}>();

defineProps<{
  rank: number;
}>();

const ranks = ref([1, 2, 3, 4, 5, 6]);
const titles = ref([
  "Leader",
  "Officer",
  "Officer Alt",
  "Raider",
  "Casual",
  "Alt",
  "Trial",
]);
</script>

<template>
  <div class="flex justify-between gap-1">
    <Btn
      v-for="r in ranks"
      :key="r"
      :disabled="rank === r"
      @click="emit('update', r)"
      :title="titles[r]"
      :type="rank === r ? 'success' : 'default'"
      class="w-full"
    >
      {{ r }}
    </Btn>
  </div>
</template>

<style scoped></style>
