<script setup lang="ts">
import { ref } from "vue";
import { ClassFilter } from "@/types";
import Btn from "./Btn.vue";

const emit = defineEmits<{
  (event: "update", role: ClassFilter): void;
}>();

defineProps<{
  role: ClassFilter;
}>();

const roles = ref<ClassFilter[]>(["ALL", "TANK", "DPS", "HEALING"]);
</script>

<template>
  <div class="flex justify-between gap-1">
    <Btn
      v-for="r in roles"
      :key="r"
      :disabled="role === r"
      @click="emit('update', r)"
      :type="role === r ? 'success' : 'default'"
      class="w-full"
    >
      {{ r === "HEALING" ? "HEALER" : r }}
    </Btn>
  </div>
</template>

<style scoped></style>
