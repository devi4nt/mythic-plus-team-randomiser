<script setup lang="ts">
import { Team } from "@/types";
import Player from "./Player.vue";
import { computed, ref, watch } from "vue";
import { useIntervalFn } from "@vueuse/core";
import ConfettiExplosion from "vue-confetti-explosion";
import { classColourLookup } from "@/utils/colours";

const props = defineProps<{
  number: number;
  team: Team;
}>();

const showConfetti = ref(false);
const team = computed(() => props.team);
const amount = ref(0);

const colors = computed(() =>
  team.value.members.map((member) => {
    if (member.pug) {
      return "#e5a023";
    }
    return classColourLookup[member.character.class];
  })
);

watch(
  team,
  () => {
    amount.value = 0;
    showConfetti.value = false;
    const { pause } = useIntervalFn(async () => {
      amount.value++;
      if (amount.value > 5) {
        showConfetti.value = true;
        pause();
      }
    }, 500);
  },
  { immediate: true }
);
</script>

<template>
  <div class="fixed inset-0 z-10">
    <ConfettiExplosion
      v-if="showConfetti"
      class="absolute left-1/2 -translate-x-1/2"
      :particle-size="16"
      :colors="colors"
    />
    <div class="fixed inset-0 bg-[#454545] bg-opacity-75 transition-opacity" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        class="flex flex-col bg-[#494949] w-[400px] h-[340px] gap-2 rounded-md drop-shadow-md"
      >
        <div class="font-bold text-4xl text-gray-400 pl-4 pt-4">
          Team {{ number }}
        </div>
        <div>
          <Player
            v-for="(member, index) in team.members"
            :key="index"
            class="scaler ml-36 my-6 transition-opacity duration-300"
            :class="amount > index ? 'opacity-100' : 'opacity-0'"
            :character="member.character"
            :pug="member.pug"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scaler {
  transform: scale(2);
}
</style>
